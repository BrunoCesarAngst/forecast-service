import { ForcastPoint, StormGlass } from '@src/clients/stormGlass';
import { InternalError } from '@src/util/errors/internal-error';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super('Unexpected error during the forecast processing: ${message}');
  }
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForcastPoint {}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForcastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichedBeachData(points, beach);
        pointsWithCorrectSources.push(...enrichedBeachData);
      }
      return this.mapForecastByData(pointsWithCorrectSources);
    } catch (err) {
      throw new ForecastProcessingInternalError(err.message);
    }
  }

  private enrichedBeachData(
    points: ForcastPoint[],
    beach: Beach
  ): BeachForecast[] {
    return points.map((e) => ({
      ...{},
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...e,
    }));
  }

  private mapForecastByData(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }
    return forecastByTime;
  }
}