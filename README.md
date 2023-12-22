# gatsby-transformer-source-code

Adds SourceCode nodes to gatsby. You can specify which MIME Types to process in the transformer options.

## Install

`npm install --save gatsby-transformer-source-code`

**Note:** You also need to have `gatsby-source-filesystem` installed and configured so it points to your files.

## How to use

In your `gatsby-config.js`

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-transformer-source-code`,
      options: {
        mimeTypes: ['application/javascript', 'text/plain']
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./src/data/`
      }
    }
  ]
};
```

Where the _source folder_ `./src/data/` contains .js/.txt files.

**NOTE**: If you do not provide a `mimeTypes` array in options, all files will be processed.

## How to query

You can query the nodes using GraphQL, like from the GraphiQL browser: `http://localhost:8000/___graphql`.

### Query all source code files

```graphql
{
  allSourceCode {
    nodes {
      content
    }
  }
}
```

Returns:

```json
{
  "data": {
    "allSourceCode": {
      "nodes": [
        {
          "content": "content of file"
        },
        {
          "content": "content of second file"
        }
      ]
    }
  }
}
```

### Query a specific plain text file

```graphql
{
  file(relativePath: { eq: "LICENSE" }) {
    childSourceCode {
      ... on SourceCode {
        content
      }
    }
  }
}
```

Returns:

```json
{
  "data": {
    "file": {
      "childSourceCode": {
        "content": "MIT License"
      }
    }
  }
}
```
