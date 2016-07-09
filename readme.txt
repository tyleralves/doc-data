The doc-data project queries DOC's arcgis 'NamedExperiences' api, joins the results with DOC's website data (description, thumbnail, etc) and displays the results on a google map.

See current features below, and future plans within the todos below.

Features:
- User specified 'text' query to DOC's arcgis 'Named Experiences' data
- Data returned from the query is displayed as markers and info windows on a google map
- Data from DOC's website data is joined to locations and displayed in info windows

TODO: Expand query options
TODO: Download DOC arcgis json, convert all coordinates to JSON, store in database (?)
TODO: Allow search for specific track and display full polyline, zoom to extents, display elevation profile (javascript api elevation-paths)