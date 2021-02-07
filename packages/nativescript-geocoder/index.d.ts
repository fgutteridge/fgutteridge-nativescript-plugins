export declare class Geocoder {
	public reverseGeocode(location: LatLng): Promise<ReverseGeocodeResult>
}

export declare interface ReverseGeocodeResult {
	name: string | null
	ISOcountryCode: string | null			// e.g., CA, US, DE
	country: string | null
	postalCode: string | null
	administrativeArea: string | null		// state/province
	subAdministrativeArea: string | null	// additional info about admin. area
	locality: string | null					// city
	subLocality: string | null				// additional info about city
	thoroughfare: string | null				// street address
	subThoroughfare: string | null			// additional info about thoroughfare
}

export declare interface LatLng {
	latitude: number
	longitude: number
}
