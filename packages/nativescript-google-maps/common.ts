import {
  MapView, Position, Marker, Shape, Polyline, Polygon, Projection,
  Circle, Camera, MarkerEventData, ShapeEventData, VisibleRegion,
  CameraEventData, PositionEventData, Bounds, Style, UISettings, IndoorBuilding, IndoorLevel,
  IndoorLevelActivatedEventData, BuildingFocusedEventData, CameraUpdate
} from './';

import {
  View,
  Image,
  LayoutBase,
  Property,
  Color,
  StackLayout,
  ProxyViewContainer,
  eachDescendant
} from '@nativescript/core';

import { Point, Template, KeyedTemplate } from "@nativescript/core/ui/core/view";
import { parseMultipleTemplates, parse } from "@nativescript/core/ui/builder";

function onInfoWindowTemplatesChanged(mapView: MapViewBase) {
  let _infoWindowTemplates = new Array<KeyedTemplate>();

  if (mapView.infoWindowTemplates && typeof mapView.infoWindowTemplates === "string") {
      _infoWindowTemplates = _infoWindowTemplates.concat(parseMultipleTemplates(mapView.infoWindowTemplates));
  } else if (mapView.infoWindowTemplates) {
      _infoWindowTemplates = _infoWindowTemplates.concat(<KeyedTemplate[]>mapView.infoWindowTemplates);
  }

  mapView._infoWindowTemplates = _infoWindowTemplates;
}

function onMapPropertyChanged(mapView: MapViewBase) {
  if (!mapView.processingCameraEvent) mapView.updateCamera();
}

function onSetMinZoomMaxZoom(mapView: MapViewBase) {
  mapView.setMinZoomMaxZoom();
}

function onPaddingPropertyChanged(mapView: MapViewBase) {
  mapView.updatePadding();
}

function paddingValueConverter(value: any) {
  if (!Array.isArray(value)) {
      value = String(value).split(',');
  }

  value = value.map((v) => parseInt(v, 10));

  if (value.length >= 4) {
      return value;
  } else if (value.length === 3) {
      return [value[0], value[1], value[2], value[2]];
  } else if (value.length === 2) {
      return [value[0], value[0], value[1], value[1]];
  } else if (value.length === 1) {
      return [value[0], value[0], value[0], value[0]];
  } else {
      return [0, 0, 0, 0];
  }
}

function onDescendantsLoaded(view: View, callback: () => void) {
  if (!view) return callback();

  let loadingCount = 1;
  let loadedCount = 0;

  const watchLoaded = (view, event) => {
      const onLoaded = () => {
          view.off(event, onLoaded);
          loadedCount++;

          if (view instanceof Image && view.isLoading) {
              loadingCount++;
              watchLoaded(view, 'isLoadingChange');

              if (view.nativeView.onAttachedToWindow) {
                  view.nativeView.onAttachedToWindow();
              }
          }

          if (loadedCount === loadingCount) callback();
      };
      view.on(event, onLoaded);
  };

  eachDescendant(view, (descendant) => {
      loadingCount++;
      watchLoaded(descendant, View.loadedEvent);
      return true;
  });

  watchLoaded(view, View.loadedEvent);
}

export { Style as StyleBase };

export module knownTemplates {
  export const infoWindowTemplate = "infoWindowTemplate";
}

export module knownMultiTemplates {
  export const infoWindowTemplates = "infoWindowTemplates";
}

export function getColorHue(color: Color | string | number): number {
  if (typeof color === 'number') {
      while (color < 0) { color += 360; }
      return color % 360;
  }
  if (typeof color === 'string') color = new Color(color);
  if (!(color instanceof Color)) return color;

  let min, max, delta, hue;

  const r = Math.max(0, Math.min(1, color.r / 255));
  const g = Math.max(0, Math.min(1, color.g / 255));
  const b = Math.max(0, Math.min(1, color.b / 255));

  min = Math.min(r, g, b);
  max = Math.max(r, g, b);

  delta = max - min;

  if (delta == 0) { // white, grey, black
      hue = 0;
  } else if (r == max) {
      hue = (g - b) / delta; // between yellow & magenta
  } else if (g == max) {
      hue = 2 + (b - r) / delta; // between cyan & yellow
  } else {
      hue = 4 + (r - g) / delta; // between magenta & cyan
  }

  hue = ((hue * 60) + 360) % 360; // degrees

  return hue;
}

export abstract class MapViewBase extends View implements MapView {

  // @ts-ignore
  public abstract get ios(): never;
  // @ts-ignore
  public abstract get android(): never;

  protected _gMap: any;
  protected _markers: Array<MarkerBase> = new Array<MarkerBase>();
  protected _shapes: Array<ShapeBase> = new Array<ShapeBase>();
  public _processingCameraEvent: boolean;
  public latitude: number;
  public longitude: number;
  public bearing: number;
  public zoom: number;
  public minZoom: number;
  public maxZoom: number;
  public tilt: number;
  public padding: number[];
  public mapAnimationsEnabled: boolean;

  public infoWindowTemplate: string | Template;
  public infoWindowTemplates: string | Array<KeyedTemplate>;
  public _defaultInfoWindowTemplate: KeyedTemplate = {
      key: "",
      createView: () => {
          if (this.infoWindowTemplate) {
              return parse(this.infoWindowTemplate, this);
          }
          return undefined;
      }
  };
  public _infoWindowTemplates = new Array<KeyedTemplate>();

  public abstract get projection(): Projection;
  public abstract get settings(): UISettingsBase;
  public abstract get myLocationEnabled(): boolean;

  public static mapReadyEvent: string = "mapReady";
  public static markerSelectEvent: string = "markerSelect";
  public static markerInfoWindowTappedEvent: string = "markerInfoWindowTapped";
  public static markerInfoWindowClosedEvent: string = "markerInfoWindowClosed";
  public static shapeSelectEvent: string = "shapeSelect";
  public static markerBeginDraggingEvent: string = "markerBeginDragging";
  public static markerEndDraggingEvent: string = "markerEndDragging";
  public static markerDragEvent: string = "markerDrag";
  public static coordinateTappedEvent: string = "coordinateTapped";
  public static coordinateLongPressEvent: string = "coordinateLongPress";
  public static cameraChangedEvent: string = "cameraChanged";
  public static cameraMoveEvent: string = "cameraMove";
  public static myLocationTappedEvent: string = "myLocationTapped";
  public static indoorBuildingFocusedEvent: string = "indoorBuildingFocused";
  public static indoorLevelActivatedEvent: string = "indoorLevelActivated";

  public get gMap() {
      return this._gMap;
  }

  public get processingCameraEvent(): boolean {
      return this._processingCameraEvent;
  }

  public _getMarkerInfoWindowContent(marker: MarkerBase) {
      var view;

      if (marker && marker._infoWindowView) {
          view = marker._infoWindowView;
          return view;
      }

      const template: KeyedTemplate = this._getInfoWindowTemplate(marker);

      if (template) view = template.createView();

      if (!view) return null;

      if (!(view instanceof LayoutBase) ||
          view instanceof ProxyViewContainer) {
          let sp = new StackLayout();
          sp.addChild(view);
          view = sp;
      }

      marker._infoWindowView = view;

      view.bindingContext = marker;

      onDescendantsLoaded(view, () => {
          marker.hideInfoWindow();
          marker.showInfoWindow();
      });

      this._addView(view);

      view.onLoaded();

      return view;
  }

  protected _unloadInfoWindowContent(marker: MarkerBase) {
      if (marker._infoWindowView) {
          marker._infoWindowView.onUnloaded();
          marker._infoWindowView = null;
      }
  }

  public _getInfoWindowTemplate(marker: MarkerBase): KeyedTemplate {
      if(marker){
          const templateKey = marker.infoWindowTemplate;
          for (let i = 0, length = this._infoWindowTemplates.length; i < length; i++) {
              if (this._infoWindowTemplates[i].key === templateKey) {
                  return this._infoWindowTemplates[i];
              }
          }
      }
      return this._defaultInfoWindowTemplate;
  }

  public abstract findMarker(callback: (marker: Marker) => boolean): Marker;

  public abstract addPolyline(shape: Polyline): void;

  public abstract addPolygon(shape: Polygon): void;

  public abstract addCircle(shape: Circle): void;

  public abstract removeShape(shape: Shape): void;

  public abstract findShape(callback: (shape: Shape) => boolean): Shape;

  public abstract setStyle(style: Style): boolean;

  public abstract updateCamera(): void;

  public abstract animateCameraUpdate(update: CameraUpdate): void;

  public abstract setViewport(b: Bounds, p?: number): void;

  public abstract updatePadding(): void;

  public abstract setMinZoomMaxZoom(): void;

  public abstract addMarker(...markers: Marker[]): void;

  public abstract removeMarker(...markers: Marker[]): void;

  public abstract removeAllMarkers(): void;

  public abstract removeAllShapes(): void;

  public abstract clear(): void;

  public removeAllPolylines() {
      if(!this._shapes) return null;
      this._shapes.forEach(shape => {
          if (shape.shape === 'polyline') {
              this.removeShape(shape);
          }
      });
  }

  public removeAllPolygons() {
      if(!this._shapes) return null;
      this._shapes.forEach(shape => {
          if (shape.shape === 'polygon') {
              this.removeShape(shape);
          }
      });
  }

  public removeAllCircles() {
      if(!this._shapes) return null;
      this._shapes.forEach(shape => {
          if (shape.shape === 'circle') {
              this.removeShape(shape);
          }
      });
  }

  notifyMapReady() {
      this.notify({ eventName: MapViewBase.mapReadyEvent, object: this, gMap: this.gMap });
  }

  notifyMarkerEvent(eventName: string, marker: Marker) {
      let args: MarkerEventData = { eventName: eventName, object: this, marker: marker };
      this.notify(args);
  }

  notifyShapeEvent(eventName: string, shape: Shape) {
      let args: ShapeEventData = { eventName: eventName, object: this, shape: shape };
      this.notify(args);
  }

  notifyMarkerTapped(marker: MarkerBase) {
      this.notifyMarkerEvent(MapViewBase.markerSelectEvent, marker);
  }

  notifyMarkerInfoWindowTapped(marker: MarkerBase) {
      this.notifyMarkerEvent(MapViewBase.markerInfoWindowTappedEvent, marker);
  }

  notifyMarkerInfoWindowClosed(marker: MarkerBase) {
      this.notifyMarkerEvent(MapViewBase.markerInfoWindowClosedEvent, marker);
  }

  notifyShapeTapped(shape: ShapeBase) {
      this.notifyShapeEvent(MapViewBase.shapeSelectEvent, shape);
  }

  notifyMarkerBeginDragging(marker: MarkerBase) {
      this.notifyMarkerEvent(MapViewBase.markerBeginDraggingEvent, marker);
  }

  notifyMarkerEndDragging(marker: MarkerBase) {
      this.notifyMarkerEvent(MapViewBase.markerEndDraggingEvent, marker);
  }

  notifyMarkerDrag(marker: MarkerBase) {
      this.notifyMarkerEvent(MapViewBase.markerDragEvent, marker);
  }

  notifyPositionEvent(eventName: string, position: Position) {
      let args: PositionEventData = { eventName: eventName, object: this, position: position };
      this.notify(args);
  }

  notifyCameraEvent(eventName: string, camera: Camera) {
      let args: CameraEventData = { eventName: eventName, object: this, camera: camera };
      this.notify(args);
  }

  notifyMyLocationTapped() {
      this.notify({ eventName: MapViewBase.myLocationTappedEvent, object: this });
  }

  notifyBuildingFocusedEvent(indoorBuilding: IndoorBuilding) {
      let args: BuildingFocusedEventData = { eventName: MapViewBase.indoorBuildingFocusedEvent, object: this, indoorBuilding: indoorBuilding };
      this.notify(args);
  }

  notifyIndoorLevelActivatedEvent(activateLevel: IndoorLevel) {
      let args: IndoorLevelActivatedEventData = { eventName: MapViewBase.indoorLevelActivatedEvent, object: this, activateLevel: activateLevel };
      this.notify(args);
  }
}

export const infoWindowTemplateProperty = new Property<MapViewBase, string | Template>({ name: "infoWindowTemplate" });
infoWindowTemplateProperty.register(MapViewBase);

export const infoWindowTemplatesProperty = new Property<MapViewBase, string | Array<KeyedTemplate>>({ name: "infoWindowTemplates", valueChanged: onInfoWindowTemplatesChanged })
infoWindowTemplatesProperty.register(MapViewBase);

export const latitudeProperty = new Property<MapViewBase, number>({ name: 'latitude', defaultValue: 0, valueChanged: onMapPropertyChanged });
latitudeProperty.register(MapViewBase);

export const longitudeProperty = new Property<MapViewBase, number>({ name: 'longitude', defaultValue: 0, valueChanged: onMapPropertyChanged });
longitudeProperty.register(MapViewBase);

export const bearingProperty = new Property<MapViewBase, number>({ name: 'bearing', defaultValue: 0, valueChanged: onMapPropertyChanged });
bearingProperty.register(MapViewBase);

export const zoomProperty = new Property<MapViewBase, number>({ name: 'zoom', defaultValue: 0, valueChanged: onMapPropertyChanged });
zoomProperty.register(MapViewBase);

export const minZoomProperty = new Property<MapViewBase, number>({ name: 'minZoom', defaultValue: 0, valueChanged: onSetMinZoomMaxZoom });
minZoomProperty.register(MapViewBase);

export const maxZoomProperty = new Property<MapViewBase, number>({ name: 'maxZoom', defaultValue: 22, valueChanged: onSetMinZoomMaxZoom });
maxZoomProperty.register(MapViewBase);

export const tiltProperty = new Property<MapViewBase, number>({ name: 'tilt', defaultValue: 0, valueChanged: onMapPropertyChanged });
tiltProperty.register(MapViewBase);

export const paddingProperty = new Property<MapViewBase, number[]>({ name: 'padding', valueChanged: onPaddingPropertyChanged, valueConverter: paddingValueConverter });
paddingProperty.register(MapViewBase);

export const mapAnimationsEnabledProperty = new Property<MapViewBase, boolean>({ name: 'mapAnimationsEnabled', defaultValue: true });
mapAnimationsEnabledProperty.register(MapViewBase);

export abstract class CameraUpdateBase implements CameraUpdate {
    public abstract get ios(): any;
    public abstract get android(): any;
}

export abstract class UISettingsBase implements UISettings {
  public abstract get compassEnabled(): boolean;
  public abstract get indoorLevelPickerEnabled(): boolean;
  public abstract get mapToolbarEnabled(): boolean;
  public abstract get myLocationButtonEnabled(): boolean;
  public abstract get rotateGesturesEnabled(): boolean;
  public abstract get scrollGesturesEnabled(): boolean;
  public abstract get tiltGesturesEnabled(): boolean;
  public abstract get zoomControlsEnabled(): boolean;
  public abstract get zoomGesturesEnabled(): boolean;
}

export abstract class ProjectionBase implements Projection {
  public abstract get ios(): any; /* GMSProjection */
  public abstract get android(): any;
  public abstract get visibleRegion(): VisibleRegion;
  public abstract fromScreenLocation(point: Point): Position;
  public abstract toScreenLocation(position: Position): Point;
}

export abstract class VisibleRegionBase implements VisibleRegion {
  public abstract get ios(): any;
  public abstract get android(): any;
  public abstract get nearLeft(): Position;
  public abstract get nearRight(): Position;
  public abstract get farLeft(): Position;
  public abstract get farRight(): Position;
  public abstract get bounds(): Bounds;
}

export abstract class PositionBase implements Position {
  public abstract get ios(): any; /* CLLocationCoordinate2D */
  public abstract get android(): any;
  public abstract get latitude(): number;
  public abstract get longitude(): number;
  public abstract distanceTo(position: Position): number;
}

export abstract class BoundsBase implements Bounds {
  public abstract get ios(): any; /* GMSCoordinateBounds */
  public abstract get android(): any;
  public abstract get northeast(): Position;
  public abstract get southwest(): Position;
}

export abstract class MarkerBase implements Marker {
  public abstract get ios(): any;
  public abstract get android(): any;
  public _infoWindowView: any;
  public infoWindowTemplate: string;
  public abstract get position(): Position;
  public abstract get rotation(): number;
  public abstract get anchor(): Array<number>;
  public abstract get title(): string;
  public abstract get snippet(): string;
  public abstract get color(): Color | string | number;
  public abstract get icon(): Image | string;
  public abstract get alpha(): number;
  public abstract get flat(): boolean;
  public abstract get draggable(): boolean;
  public abstract get visible(): boolean;
  public abstract get zIndex(): number;
  public abstract showInfoWindow(): void;
  public abstract isInfoWindowShown(): boolean;
  public abstract hideInfoWindow(): void;
}

export abstract class ShapeBase implements Shape {
  public abstract get ios(): any;
  public abstract get android(): any;
  public _map: any;
  public shape: string;
  public userData: any;
  public abstract get zIndex(): number;
  public abstract get visible(): boolean;
  public abstract get clickable(): boolean;
}

export abstract class PolylineBase extends ShapeBase implements Polyline {
  public shape: string = 'polyline';
  public _points: Array<PositionBase>;
  public abstract get color(): Color;
  public abstract get width(): number;
  public abstract get geodesic(): boolean;

  addPoint(point: PositionBase): void {
      this._points.push(point);
      this.reloadPoints();
  }

  addPoints(points: PositionBase[]): void {
      this._points = this._points.concat(points);
      this.reloadPoints();
  }

  removePoint(point: PositionBase): void {
      var index = this._points.indexOf(point);
      if (index > -1) {
          this._points.splice(index, 1);
          this.reloadPoints();
      }
  }

  removeAllPoints(): void {
      this._points.length = 0;
      this.reloadPoints();
  }

  getPoints(): Array<PositionBase> {
      return this._points.slice();
  }

  public abstract reloadPoints(): void;
}

export abstract class PolygonBase extends ShapeBase implements Polygon {
  public shape: string = 'polygon';
  public _points: Array<PositionBase>;
  public _holes: Array<Array<PositionBase>>;
  public abstract get strokeWidth(): number;
  public abstract get strokeColor(): Color;
  public abstract get fillColor(): Color;

  addPoint(point: PositionBase): void {
      this._points.push(point);
      this.reloadPoints();
  }

  addPoints(points: PositionBase[]): void {
      this._points = this._points.concat(points);
      this.reloadPoints();
  }

  removePoint(point: PositionBase): void {
      var index = this._points.indexOf(point);
      if (index > -1) {
          this._points.splice(index, 1);
          this.reloadPoints();
      }
  }

  removeAllPoints(): void {
      this._points.length = 0;
      this.reloadPoints();
  }

  getPoints(): Array<PositionBase> {
      return this._points.slice();
  }

  addHole(hole: PositionBase[]): void {
      this._holes.push(hole);
      this.reloadHoles();
  }

  addHoles(holes: PositionBase[][]): void {
      this._holes = this._holes.concat(holes);
      this.reloadHoles();
  }

  removeHole(hole: PositionBase[]): void {
      var index = this._holes.indexOf(hole);
      if (index > -1) {
          this._holes.splice(index, 1);
          this.reloadHoles();
      }
  }

  removeAllHoles(): void {
      this._holes.length = 0;
      this.reloadHoles();
  }

  getHoles(): Array<Array<PositionBase>> {
      return this._holes.slice();
  }

  public abstract reloadPoints(): void;

  public abstract reloadHoles(): void;
}

export abstract class CircleBase extends ShapeBase implements Circle {
  public shape: string = 'circle';
  public abstract get center(): Position;
  public abstract get radius(): number;
  public abstract get strokeWidth(): number;
  public abstract get strokeColor(): Color;
  public abstract get fillColor(): Color;
}
