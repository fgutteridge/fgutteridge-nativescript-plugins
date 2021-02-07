import { android as androidApp } from '@nativescript/core/application'
import { ReverseGeocodeResult, LatLng } from '.'
import { GeocoderBase } from './common'

export class Geocoder extends GeocoderBase {
    public reverseGeocode(location: LatLng): Promise<ReverseGeocodeResult> {
        const geocoder = new android.location.Geocoder(androidApp.context)

        try {
            const places = geocoder.getFromLocation(location.latitude, location.longitude, 1)
            if (places.size() === 0)
                return Promise.reject('Geocoder error: no places found.')

            const place: android.location.Address = places.get(0)

            return Promise.resolve(<ReverseGeocodeResult> {
                name: place.toString(),
                ISOcountryCode: place.getCountryCode(),
                country: place.getCountryName(),
                postalCode: place.getPostalCode(),
                administrativeArea: place.getAdminArea(),
                subAdministrativeArea: place.getSubAdminArea(),
                locality: place.getLocality(),
                subLocality: place.getSubLocality(),
                thoroughfare: place.getThoroughfare(),
                subThoroughfare: place.getSubThoroughfare(),
            })
        } catch (e) {
            return Promise.reject(e)
        }
    }
}
