import { Geocoder, ReverseGeocodeResult, LatLng } from '.'

export abstract class GeocoderBase implements Geocoder {
	public abstract reverseGeocode(location: LatLng): Promise<ReverseGeocodeResult>
}
