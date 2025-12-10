// // helpers/sequelizeWrapper.js
// function getAllWithAssociations(model) {
//   const includes = [];
//   for (const assocKey in model.associations) {
//     includes.push({
//       model: model.associations[assocKey].target,
//       as: model.associations[assocKey].as
//     });
//   }
//   return model.findAll({ include: includes });
// }

// module.exports = { getAllWithAssociations };


function buildIncludes(model, visited = new Set(), depth = 1, maxDepth = 2) {
  if (depth > maxDepth || visited.has(model)) return [];

  visited.add(model);

  const includes = [];

  for (const assocKey in model.associations) {
    const association = model.associations[assocKey];
    const targetModel = association.target;

    // Avoid circular reference
    if (targetModel === model) continue;

    includes.push({
      model: targetModel,
      as: association.as,
      include: buildIncludes(targetModel, new Set(visited), depth + 1, maxDepth)
    });
  }

  return includes;
}

function getAllWithAssociations(model, maxDepth = 2,where) {
  const includes = buildIncludes(model, new Set(), 1, maxDepth);
  console.log("{where:where, include: includes }",{where:where, include: includes })
  return model.findAll({where:where, include: includes });
}

module.exports = { getAllWithAssociations };
