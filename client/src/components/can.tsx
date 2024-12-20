import rules from "../utils/rbac-rule";


/**
 * Check if user has access to view 
 * the element to displayed in the yes 
 * prop
 * @param rules 
 * @param role 
 * @param action 
 * @param [data] 
 * @returns  
 */
const check = (rules: RulesType, role: string, action: string, data?: any) => {
  console.log("CAN ROLE:",  "*"
  +role+"*");
  const permissions = rules[role];
  if (!permissions) {
    // role is not present in the rules
    console.log("NO PERMISSIONS");
    return false;
  }

  const staticPermissions = permissions.static;

  if (staticPermissions && staticPermissions.includes(action)) {
    // static rule not provided for action
    console.log("Data is static");
    return true;
  }

  // dynmic not currently used
  const dynamicPermissions = permissions.dynamic;

  if (dynamicPermissions) {
    console.log("Data is Dynamic");
    const permissionCondition = dynamicPermissions[action];
    if (!permissionCondition) {
      // dynamic rule not provided for action
      return false;
    }
    return permissionCondition(data);
  }
  return false;
};

const Can = (props: CanPropType) =>  
  check(rules, props.role, props.perform, props.data)
    ? props.yes()
    : props.no();

Can.defaultProps = {
  yes: () => null,
  no: () => null
};

export default Can;