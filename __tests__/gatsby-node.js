const { onCreateNode } = require(`../gatsby-node`);

const createNodeId = jest.fn().mockReturnValue(`uuid-from-gatsby`);
const createContentDigest = jest.fn().mockReturnValue(`contentDigest`);
const loadNodeContent = (node) => Promise.resolve(node.content);

describe('Processing source code nodes', () => {
  let createNode;
  let createParentChildLink;
  let actions;

  beforeEach(() => {
    createNode = jest.fn();
    createParentChildLink = jest.fn();
    actions = { createNode, createParentChildLink };
  });

  const expectNodeCreated = (parent) => {
    expect(createNode).toBeCalledWith(
      expect.objectContaining({
        parent: parent,
        internal: expect.objectContaining({
          type: 'SourceCode'
        })
      })
    );

    expect(createParentChildLink).toHaveBeenCalled();
  };

  it('should process text files without mimeTypes options', async () => {
    const node = {
      id: '42',
      internal: {
        type: 'File',
        mediaType: 'text/plain'
      }
    };

    await onCreateNode({
      node,
      actions,
      loadNodeContent,
      createNodeId,
      createContentDigest
    });

    expectNodeCreated('42');
  });

  it('should process ambiguous files without mimeTypes option', async () => {
    const node = {
      id: '21',
      internal: {
        type: 'File',
        mediaType: 'application/octet-stream'
      }
    };

    await onCreateNode({
      node,
      actions,
      loadNodeContent,
      createNodeId,
      createContentDigest
    });

    expectNodeCreated('21');
  });

  it('should ignore files not specified in mimeTypes option', async () => {
    const node = {
      id: '21',
      internal: {
        type: 'File',
        mediaType: 'image/png'
      }
    };

    await onCreateNode(
      {
        node,
        actions,
        loadNodeContent,
        createNodeId,
        createContentDigest
      },
      { mimeTypes: ['image/jpeg'] }
    );

    expect(createNode).toHaveBeenCalledTimes(0);
  });

  it('should process files specified in mimeTypes option', async () => {
    const node = {
      id: '21',
      internal: {
        type: 'File',
        mediaType: 'image/png'
      }
    };

    await onCreateNode(
      {
        node,
        actions,
        loadNodeContent,
        createNodeId,
        createContentDigest
      },
      { mimeTypes: ['image/png'] }
    );

    expect(createNode).toHaveBeenCalledTimes(1);
  });
});
