process.env.R3_G03_OUTPUT ??= 'docs/commercialization/r3/evidence/r3-2-surfaces';
process.env.R3_G03_REVISION_LABEL ??= 'R3.2 primary surfaces';
process.env.R3_G03_EVIDENCE_TAG ??= 'OWNER GATE 2';
process.env.R3_G03_CLOSEUPS ??=
  'nose-monocoque-closeup,sidepod-floor-closeup,engine-cover-closeup,front-wing-closeup,rear-wing-closeup,halo-mounts-closeup';
process.env.R3_G03_BEFORE_DIR ??= 'docs/commercialization/r3/evidence/r3-1-blockout';

await import('./capture-r3-g03-blockout.mjs');
