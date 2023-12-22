const { onCreateNode } = require(`../gatsby-node`);

const createNodeId = jest.fn().mockReturnValue(`uuid-from-gatsby`);
const createContentDigest = jest.fn().mockReturnValue(`contentDigest`);
const loadNodeContent = (node) => Promise.resolve(node.content);

describe("Processing plaintext nodes", () => {
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
          type: "PlainText",
        }),
      })
    );

    expect(createParentChildLink).toHaveBeenCalled();
  };

  it("should process plain/text files", async () => {
    const node = {
      id: "42",
      internal: {
        type: "File",
        mediaType: "text/plain",
        extension: "txt",
      },
    };

    await onCreateNode({
      node,
      actions,
      loadNodeContent,
      createNodeId,
      createContentDigest,
    });

    expectNodeCreated("42");
  });

  it("should process files without extension", async () => {
    const node = {
      id: "21",
      internal: {
        type: "File",
        mediaType: "application/octet-stream",
      },
    };

    await onCreateNode({
      node,
      actions,
      loadNodeContent,
      createNodeId,
      createContentDigest,
    });

    expectNodeCreated("21");
  });

  it("should ignore non text files", async () => {
    const node = {
      id: "21",
      internal: {
        type: "File",
        mediaType: "image/png",
      },
    };

    await onCreateNode({
      node,
      actions,
      loadNodeContent,
      createNodeId,
      createContentDigest,
    });

    expect(createNode).toHaveBeenCalledTimes(0);
  });
});
