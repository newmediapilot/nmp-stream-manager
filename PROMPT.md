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
Understand how each file relates to each-other.
Understand how the application works.
Understand the routes the app has exposed.
Understand the API endpoints (src/modules)
Understand the HTML endpoints (src/views)
Understand all the comments.
Understand all the console logs.
Understand all the functions logs.
Understand all the functions required modules.
Understand the package.json file.
Understand what this app is, its features, what it does.
Then log the file-tree and say ready.

When I ask you for code output, never add inline comments to explain things.
Please keep explanations short but always warn if there is a gotcha or 
something that could cause a bug or crash or is generally not recommended
because of some danger.