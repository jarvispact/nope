const success = (v) => {
  return {
    status: "SUCCESS",
    value: v
  };
};
const failure = (v) => {
  return {
    status: "FAILURE",
    value: v
  };
};
const isSuccess = (either) => either.status === "SUCCESS";
const isFailure = (either) => either.status === "FAILURE";
const valueOf = (either) => either.value;
const fold = (either, {
  onSuccess,
  onFailure
}) => isSuccess(either) ? onSuccess(either.value) : onFailure(either.value);
const err = (schema2, code, message, details) => ({
  schema: schema2,
  code,
  message,
  details
});
const objectKeys = (rec) => Object.keys(rec);
const isObject = (v) => typeof v === "object" && !Array.isArray(v) && v !== null;
const getDisplayType = (value) => {
  if (value === null)
    return "null";
  if (value instanceof Date)
    return "date";
  if (isObject(value))
    return "record";
  if (Array.isArray(value))
    return "array";
  return typeof value;
};
const isLiteralSchema = (schema2) => schema2.schema === "literal";
const isRecordSchema = (schema2) => schema2.schema === "record";
const schema = "array";
const notAArray = (input) => err(schema, "E_NOT_A_ARRAY", "provided value is not of type array", {
  provided: {
    type: getDisplayType(input),
    value: input
  },
  expected: {
    type: "array"
  }
});
const array = (wrappedSchema, constraints) => {
  if (Array.isArray(constraints) && constraints.length < 1) {
    throw new Error("empty constraints array is not allowed. provide at least 1 constraint or omit the empty array from the call to number()");
  }
  const I = null;
  const O = null;
  const E = null;
  const validate = (input) => {
    if (!Array.isArray(input)) {
      return failure({
        errors: [notAArray(input)],
        items: []
      });
    }
    const constraintErrors = (constraints || []).map((c) => {
      if (!c.when(input))
        return void 0;
      const { code, message, details } = c.error(input);
      return err(schema, code, message, details);
    }).filter(Boolean);
    const items = input.map((item) => wrappedSchema.validate(item));
    const itemsHaveErrors = items.some((item) => item.status === "FAILURE");
    if (constraintErrors.length || itemsHaveErrors) {
      return failure({
        errors: constraintErrors,
        items
      });
    }
    return success(input);
  };
  return {
    schema,
    I,
    O,
    E,
    validate
  };
};
const arrayConstraint = ({
  when,
  error
}) => ({
  when,
  error
});
const booleanError = (input) => err("boolean", "E_NOT_A_BOOLEAN", "provided value is not of type boolean", {
  provided: {
    type: getDisplayType(input),
    value: input
  },
  expected: {
    type: "boolean"
  }
});
const boolean = () => {
  const I = null;
  const O = null;
  const E = null;
  const validate = (input) => typeof input === "boolean" ? success(input) : failure(booleanError(input));
  return {
    schema: "boolean",
    I,
    O,
    E,
    validate
  };
};
const notADateError = (input) => err("date", "E_NOT_A_DATE", "provided value is not of type date", {
  provided: {
    type: getDisplayType(input),
    value: input
  },
  expected: {
    type: "date"
  }
});
const invalidDateError = (input) => err("date", "E_INVALID_DATE", "provided date is invalid", {
  provided: {
    type: getDisplayType(input),
    value: input
  },
  expected: {
    type: "date"
  }
});
const date = (constraints) => {
  if (Array.isArray(constraints) && constraints.length < 1) {
    throw new Error("empty constraints array is not allowed. provide at least 1 constraint or omit the empty array from the call to date()");
  }
  const I = null;
  const O = null;
  const E = null;
  const validate = (input) => {
    if (!(input instanceof Date)) {
      return failure([notADateError(input)]);
    }
    if (input.toString() === "Invalid Date") {
      return failure([invalidDateError(input)]);
    }
    const errors = (constraints || []).map((c) => {
      if (!c.when(input))
        return void 0;
      const { code, message, details } = c.error(input);
      return err("date", code, message, details);
    }).filter(Boolean);
    return errors.length ? failure(errors) : success(input);
  };
  return {
    schema: "date",
    I,
    O,
    E,
    validate
  };
};
const dateConstraint = ({
  when,
  error
}) => ({
  when,
  error
});
const literalError = (literal2, input) => err("literal", "E_INVALID_LITERAL", `the provided value does not match the specified literal: "${literal2}"`, {
  provided: {
    type: getDisplayType(input),
    value: input
  },
  expected: {
    type: `${typeof literal2}-literal`,
    literal: literal2
  }
});
const literal = (l) => {
  const literal2 = l;
  const I = null;
  const O = null;
  const E = null;
  const validate = (input) => input === l ? success(input) : failure(literalError(l, input));
  return {
    schema: "literal",
    literal: literal2,
    I,
    O,
    E,
    validate
  };
};
const nullable = (wrappedSchema) => {
  const I = null;
  const O = null;
  const E = null;
  const validate = (input) => input === null ? success(null) : wrappedSchema.validate(input);
  return {
    schema: "nullable",
    I,
    O,
    E,
    validate
  };
};
const numberError = (input) => err("number", "E_NOT_A_NUMBER", "provided value is not of type number", {
  provided: {
    type: getDisplayType(input),
    value: input
  },
  expected: {
    type: "number"
  }
});
const number = (constraints) => {
  if (Array.isArray(constraints) && constraints.length < 1) {
    throw new Error("empty constraints array is not allowed. provide at least 1 constraint or omit the empty array from the call to number()");
  }
  const I = null;
  const O = null;
  const E = null;
  const validate = (input) => {
    if (typeof input !== "number")
      return failure([numberError(input)]);
    const errors = (constraints || []).map((c) => {
      if (!c.when(input))
        return void 0;
      const { code, message, details } = c.error(input);
      return err("number", code, message, details);
    }).filter(Boolean);
    return errors.length ? failure(errors) : success(input);
  };
  return {
    schema: "number",
    I,
    O,
    E,
    validate
  };
};
const numberConstraint = ({
  when,
  error
}) => ({
  when,
  error
});
const optional = (wrappedSchema) => {
  const I = null;
  const O = null;
  const E = null;
  const validate = (input) => input === void 0 ? success(void 0) : wrappedSchema.validate(input);
  return {
    schema: "optional",
    I,
    O,
    E,
    validate
  };
};
const notARecordError = (definition, input) => err("record", "E_NOT_A_RECORD", "provided value is not of type record", {
  provided: {
    type: getDisplayType(input),
    value: input
  },
  expected: {
    type: "record",
    keys: Object.keys(definition)
  }
});
const missingKeysError = (definition, input) => err("record", "E_MISSING_KEYS", "provided value has missing keys", {
  provided: {
    type: getDisplayType(input),
    value: input
  },
  expected: {
    type: "record",
    keys: Object.keys(definition)
  }
});
const tooManyKeysError = (definition, input) => err("record", "E_TOO_MANY_KEYS", "provided value has too many keys", {
  provided: {
    type: getDisplayType(input),
    value: input,
    keys: Object.keys(input)
  },
  expected: {
    type: "record",
    keys: Object.keys(definition)
  }
});
const record = (definition) => {
  const I = null;
  const O = null;
  const E = null;
  const validate = (input) => {
    if (!isObject(input)) {
      return failure({
        errors: [notARecordError(definition, input)],
        properties: {}
      });
    }
    const errors = [];
    if (objectKeys(definition).length > objectKeys(input).length) {
      errors.push(missingKeysError(definition, input));
    }
    if (objectKeys(input).length > objectKeys(definition).length) {
      errors.push(tooManyKeysError(definition, input));
    }
    const properties = objectKeys(definition).reduce((accum, key) => {
      accum[key] = definition[key].validate(input[key]);
      return accum;
    }, {});
    const propertiesHaveErrors = objectKeys(properties).some((k) => properties[k].status === "FAILURE");
    if (errors.length || propertiesHaveErrors) {
      return failure({
        errors,
        properties
      });
    }
    return success(input);
  };
  return {
    schema: "record",
    I,
    O,
    E,
    validate,
    definition
  };
};
const partial = (recordSchemaDefinition) => {
  const I = null;
  const O = null;
  const E = null;
  const validate = (input) => {
    if (!isObject(input)) {
      return failure({
        errors: [
          notARecordError(recordSchemaDefinition.definition, input)
        ],
        properties: {}
      });
    }
    const partialDefinition = Object.fromEntries(Object.entries(recordSchemaDefinition.definition).filter(([k]) => objectKeys(input).includes(k)));
    return record(partialDefinition).validate(input);
  };
  return {
    schema: "partial",
    I,
    O,
    E,
    validate
  };
};
const stringError = (input) => err("string", "E_NOT_A_STRING", "provided value is not of type string", {
  provided: {
    type: getDisplayType(input),
    value: input
  },
  expected: {
    type: "string"
  }
});
const string = (constraints) => {
  if (Array.isArray(constraints) && constraints.length < 1) {
    throw new Error("empty constraints array is not allowed. provide at least 1 constraint or omit the empty array from the call to string()");
  }
  const I = null;
  const O = null;
  const E = null;
  const validate = (input) => {
    if (typeof input !== "string")
      return failure([stringError(input)]);
    const errors = (constraints || []).map((c) => {
      if (!c.when(input))
        return void 0;
      const { code, message, details } = c.error(input);
      return err("string", code, message, details);
    }).filter(Boolean);
    return errors.length ? failure(errors) : success(input);
  };
  return {
    schema: "string",
    I,
    O,
    E,
    validate
  };
};
const stringConstraint = ({
  when,
  error
}) => ({
  when,
  error
});
const unionError = (union2, input) => err("union", "E_NOT_IN_UNION", "provided value is not in union", {
  provided: {
    type: getDisplayType(input),
    value: input
  },
  expected: {
    type: "union",
    union: union2
  }
});
const union = (possibleSchemas) => {
  const I = null;
  const O = null;
  const E = null;
  const serializedUnion = possibleSchemas.map((s) => {
    if (isLiteralSchema(s))
      return s.literal;
    if (isRecordSchema(s))
      return `record(${JSON.stringify(Object.fromEntries(Object.entries(s.definition).map(([k, v]) => [k, v.schema])))})`;
    return s.schema;
  });
  const validate = (input) => {
    const items = possibleSchemas.map((s) => s.validate(input));
    const isSuccessful = items.some((item) => item.status === "SUCCESS");
    return isSuccessful ? success(input) : failure(unionError(serializedUnion, input));
  };
  return {
    schema: "union",
    I,
    O,
    E,
    validate
  };
};
export { array, arrayConstraint, boolean, date, dateConstraint, err, failure, fold, getDisplayType, isFailure, isLiteralSchema, isObject, isRecordSchema, isSuccess, literal, notAArray, notARecordError, nullable, number, numberConstraint, objectKeys, optional, partial, record, string, stringConstraint, success, union, valueOf };
