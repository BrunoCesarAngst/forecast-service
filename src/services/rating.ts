import { Beach, CardinalPoints } from '@src/models/beach';
import { ForecastPoint } from '@src/clients/stormGlass';

const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHigh: {
    min: 1.0,
    max: 2.0,
  },
  headHigh: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(private beach: Beach) {}

  public getRateForPoint(point: ForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection);
    const windDirection = this.getPositionFromLocation(point.windDirection);
    const windAndWaveRating = this.getRatingBasedOnWindAndWavePositions(
      swellDirection,
      windDirection
    );
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);
    const finalRating =
      (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;

    return Math.round(finalRating);
  }

  public getRatingBasedOnWindAndWavePositions(
    wavePosition: CardinalPoints,
    windPosition: CardinalPoints
  ): number {
    if (wavePosition === windPosition) {
      return 1;
    } else if (this.isWindOffShore(wavePosition, windPosition)) {
      return 5;
    }

    return 3;
  }

  public getRatingForSwellPeriod(period: number): number {
    if (period >= 7 && period < 10) {
      return 2;
    }
    if (period >= 10 && period < 14) {
      return 4;
    }
    if (period >= 14) {
      return 5;
    }
    return 1;
  }

  public getRatingForSwellSize(height: number): number {
    if (
      height >= waveHeights.ankleToKnee.min &&
      height < waveHeights.ankleToKnee.max
    ) {
      return 2;
    }
    if (
      height >= waveHeights.waistHigh.min &&
      height < waveHeights.waistHigh.max
    ) {
      return 3;
    }
    if (height >= waveHeights.headHigh.min) {
      return 5;
    }
    return 1;
  }

  public getPositionFromLocation(coordinates: number): CardinalPoints {
    if (coordinates >= 310 || (coordinates < 50 && coordinates >= 0)) {
      return CardinalPoints.N;
    }
    if (coordinates >= 50 && coordinates < 120) {
      return CardinalPoints.E;
    }
    if (coordinates >= 120 && coordinates < 220) {
      return CardinalPoints.S;
    }
    if (coordinates >= 220 && coordinates < 310) {
      return CardinalPoints.W;
    }
    return CardinalPoints.E;
  }

  private isWindOffShore(
    wavePosition: CardinalPoints,
    windPosition: CardinalPoints
  ): boolean {
    return (
      (wavePosition === CardinalPoints.N &&
        windPosition === CardinalPoints.S &&
        this.beach.position === CardinalPoints.N) ||
      (wavePosition === CardinalPoints.S &&
        windPosition === CardinalPoints.N &&
        this.beach.position === CardinalPoints.S) ||
      (wavePosition === CardinalPoints.E &&
        windPosition === CardinalPoints.W &&
        this.beach.position === CardinalPoints.E) ||
      (wavePosition === CardinalPoints.W &&
        windPosition === CardinalPoints.E &&
        this.beach.position === CardinalPoints.W)
    );
  }
}
