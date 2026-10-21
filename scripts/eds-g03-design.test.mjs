import { EDS_G03_DESIGN as D, getEDS_G03TargetRatios } from './eds-g03-design.mjs';

describe('EDS-G03 R3.1 hardpoint registry', () => {
  it('keeps axle stations and wheelbase internally consistent', () => {
    expect(D.axles.rearZ - D.axles.frontZ).toBeCloseTo(D.axles.wheelbase, 8);
    expect(D.axles.wheelbase).toBeCloseTo(3.6, 8);
  });

  it('locks the owner-specified overall envelope', () => {
    const [minX, minY, minZ] = D.dimensions.bounds.min;
    const [maxX, maxY, maxZ] = D.dimensions.bounds.max;
    expect(maxZ - minZ).toBeCloseTo(D.dimensions.length, 8);
    expect(maxX - minX).toBeCloseTo(D.dimensions.width, 8);
    expect(maxY - minY).toBeCloseTo(D.dimensions.height, 8);
  });

  it('places all tyres on the neutral ground plane', () => {
    expect(D.wheels.front.centerY - D.wheels.front.radius).toBe(0);
    expect(D.wheels.rear.centerY - D.wheels.rear.radius).toBe(0);
  });

  it('matches the required normalized ratios', () => {
    const ratios = getEDS_G03TargetRatios();
    expect(ratios.wheelbaseToLength).toBeCloseTo(0.712871, 5);
    expect(ratios.widthToLength).toBeCloseTo(0.39604, 5);
    expect(ratios.frontWheelDiameterToLength).toBeCloseTo(0.142574, 5);
    expect(ratios.rearWheelDiameterToLength).toBeCloseTo(0.150495, 5);
  });

  it('keeps the blockout clear of obvious front-wheel envelope collisions', () => {
    const innerFrontWheelX = D.axles.frontTrack / 2 - D.wheels.front.width / 2;
    expect(innerFrontWheelX - D.landmarks.sidepods.envelope.x[1]).toBeGreaterThanOrEqual(0.015);
    const frontWheelLeadingZ = D.axles.frontZ - D.wheels.front.radius;
    expect(frontWheelLeadingZ - D.landmarks.frontWing.envelope.z[1]).toBeGreaterThanOrEqual(0.08);
  });

  it('locks revision 1 local envelopes without moving the approved chassis hardpoints', () => {
    expect(D.revision).toBe('R3.2-revision-3-rounded-intake-diffuser-halo');
    expect(D.landmarks.sidepods.envelope.x).toEqual([-0.66, 0.66]);
    expect(D.landmarks.floor.maxHalfWidth).toBe(0.68);
    expect(D.landmarks.rearWing.span).toBe(1.36);
    expect(D.landmarks.halo.top).toEqual([0, 0.94, -0.46]);
    expect(D.revisionHistory.lockedWithoutChange).toContain('wheelbase');
    expect(D.revisionHistory.gate1Approval.baselineCommit).toBe('0808b72');
    expect(D.revisionHistory.gate2Revision.baselineCommit).toBe('a6549c6');
    expect(D.revisionHistory.gate2Revision2.baselineCommit).toBe('a4a36a0');
    expect(D.revisionHistory.gate2Revision3.baselineCommit).toBe('14b99b6');
  });
});
