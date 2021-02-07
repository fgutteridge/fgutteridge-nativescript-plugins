import { ReverseGeocodeResult, LatLng } from '.'
import { GeocoderBase } from './common'

export class Geocoder extends GeocoderBase {
    public reverseGeocode(location: LatLng): Promise<ReverseGeocodeResult> {
        const geocoder = CLGeocoder.new()

        return new Promise((resolve, reject) => {
            geocoder.reverseGeocodeLocationCompletionHandler(new CLLocation({ latitude: location.latitude, longitude: location.longitude }), (places, error) => {
                if (error || places.count === 0)
                    reject(error ? error.description : 'Geocoder error: no places found.')

                const place = places.objectAtIndex(0)

                resolve(<ReverseGeocodeResult> {
                    name: place.name,
                    ISOcountryCode: place.ISOcountryCode,
                    country: place.country,
                    postalCode: place.postalCode,
                    administrativeArea: place.administrativeArea,
                    subAdministrativeArea: place.subAdministrativeArea,
                    locality: place.locality,
                    subLocality: place.subLocality,
                    thoroughfare: place.thoroughfare,
                    subThoroughfare: place.subThoroughfare,
                })
            })
        })
    }
}
