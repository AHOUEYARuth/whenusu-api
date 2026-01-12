/* eslint-disable prettier/prettier */

import Region from "#models/region";

export class RegionService {

  async createRegion(data: any) {
    const region = new Region()
    
    region.name = data.name
    region.location = data.location
    region.longitude = data.longitude
    region.latitude = data.latitude

    await region.save()
    return region
  }

  async getAllRegion() {
    const regions = await Region.all()
    return regions
  }

  async updateRegion(regionId: string, data: any) {
    const region = await Region.query().where('id', regionId).firstOrFail()
    if (!region) {
      throw new Error('Région non trouvé')
    }

    region.name = data.name || region.name
    region.location = data.location || region.location
    region.longitude = data.longitude || region.longitude
    region.latitude = data.latitude || region.latitude

    await region.save()
    return region
  }

  async deleteRegion(regionId: string) {
    const region = await Region.query().where('id', regionId).firstOrFail()
    if (!region) {
      throw new Error('Région non trouvé')
    }
    await region.delete()
  }
}