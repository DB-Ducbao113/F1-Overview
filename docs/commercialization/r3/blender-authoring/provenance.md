# Geometry and material provenance

- Geometry authorship: original Podium EDS procedural Blender authoring in
  `scripts/blender/eds_g03_clay_authoring.py`.
- Source inputs: numeric EDS-G03 hardpoints and owner-approved dimensional locks.
- Reference use: the DEV-only Detailed + EDS GLB and prior G03 GLB are loaded
  only by the screenshot harness for visual comparison. They are never read by
  the Blender authoring script and contribute no vertex, topology, UV or
  material data to the new GLB.
- Materials: neutral clay, technical dark, unbranded rubber and generic metal
  values created in the script. No image textures, logos, tire lettering,
  sponsor art or team branding are included.
- Export: Blender 5.2.2 LTS bundled glTF exporter; float canonicalization is an
  original deterministic post-export step and does not copy external geometry.
- Revision 2 local authorship: rounded-D sidepod lip/throat, ruled undercut
  transition shells, dense twin-channel diffuser profiles, open rim/hub/spoke
  assemblies and panel boundaries are mathematically authored in the same
  source script from project coordinates; no external mesh is sampled.
- Commercial status: review-only. The asset is under
  `docs/commercialization/r3/blender-authoring/`, not `public/models`, and is
  removed from the commercial dependency graph by existing build isolation.

The C42-derived DEV reference retains its separate provenance and rights risk.
No inference is made that software/model licensing clears third-party vehicle
design or trademark rights.
