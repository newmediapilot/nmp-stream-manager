### Prompt to start new project

We are building a project.

The project schematic is in JSON format.

The JSON format follows a convention of:

```json
{
    "file.js": "console.log(\"hello from file.js\""
    "src\\sub-file.js": "console.log(\"hello from src\\sub-file.js\""
}
```

I will upload the JSON file and i want you to analyze it.

Analyze each file and remember what it does.
Understand how each file relates to eachother.
Understand how the application works.
Understand the APIs the app has exposed.
Understand all the comments.
Understand all the console logs.
Understand the difference between API endpoints (src/modules) and HTML endpoints(src/views)

Then log the file-tree.

Just say Ready.