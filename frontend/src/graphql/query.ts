export const queryBase = (queryName: string, model:string, fields:string[], args:Record<string, any> = {}) => {
    const argString = Object.keys(args)
      .map((key) => `${key}: $${key}`)
      .join(", ");
  
    const query = `
      query ${queryName}(${Object.keys(args)
        .map((key) => `$${key}: ${args[key]}`)
        .join(", ")}) {
        ${model}(${argString}) { 
          ${fields.join("\n")}
        }
      }
    `;
  
    return query;
  };