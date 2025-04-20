// TODO: use TanStack Query
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'
import { SelectOptionArr } from '../../types/forms'
import { OSMLocationArr, OSMLocation } from '../../types/OSM'

export function useQueryLocation(query: string) {
  const debouncedQueryLocation = useDebounce(query, 500)[0]
  const [locationOptions, setLocationOptions] = useState<SelectOptionArr>([])
  const [isLocationLoading, setIsLocationLoading] = useState(false)

  useEffect(() => {
    fetchOpenStreetMapData(debouncedQueryLocation).then((data) => {
      const locationOptions = data.map((location: OSMLocation) => filterLocationEntry(location))
      if (locationOptions.length > 0) setLocationOptions(locationOptions)
      setIsLocationLoading(false)
    })
  }, [debouncedQueryLocation])

  useEffect(() => {
    setIsLocationLoading(true)
  }, [query])

  return [locationOptions, isLocationLoading] as const
}

function filterLocationEntry(location: OSMLocation) {
  return {
    label: `${location.display_name.split(',')[0]}, ${location.display_name.split(',').slice(-2)[0]}, ${
      location.display_name.split(',').slice(-1)[0]
    }`,
    value: location.display_name,
  }
}

async function fetchOpenStreetMapData(query: string): Promise<OSMLocationArr> {
  const fetchQueryParams = {
    q: query,
    format: 'json',
    addressdetails: 'addressdetails',
    limit: 5,
  }
  const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: fetchQueryParams,
    method: 'GET',
  })

  const parsedData = OSMLocationArr.parse(data)
  if (!parsedData) return []
  return parsedData
}
