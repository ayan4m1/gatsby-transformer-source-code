export async function onCreateNode(
  { node, actions, loadNodeContent, createNodeId, createContentDigest },
  options = { mimeTypes: [] }
) {
  if (node.internal.type !== 'File') {
    return;
  }

  if (
    options.mimeTypes &&
    options.mimeTypes.length &&
    !options.mimeTypes.includes(node.internal.mediaType)
  ) {
    return;
  }

  const { createNode, createParentChildLink } = actions;
  const content = await loadNodeContent(node);
  const id = createNodeId(`${node.id} >>> SourceCode`);
  const sourceCodeNode = {
    id,
    children: [],
    content,
    parent: node.id,
    internal: {
      contentDigest: createContentDigest(content),
      type: 'SourceCode'
    }
  };
  createNode(sourceCodeNode);
  createParentChildLink({
    parent: node,
    child: sourceCodeNode
  });
}
