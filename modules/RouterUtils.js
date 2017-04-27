import {
  Actions,
} from 'history';
import reducer from './Reducer';
import {
  createPartialState,
  LOCATION_CHANGE,
} from './ReducerUtils';

import type {
  EnhancedNavigationRoute,
  NavigationAction,
} from './TypeDefinition';

const {
  REPLACE: HISTORY_REPLACE,
} = Actions;

/* eslint-disable import/prefer-default-export */
export function createNavigationState(
  navigationState: EnhancedNavigationRoute,
  routerState
): EnhancedNavigationRoute {
/* eslint-enable */
  const {
    routes,
    location,
    params,
  } = routerState;
  const nextNavigationState = createPartialState(routes, location, params);
  const type = LOCATION_CHANGE;

  // TODO Double taps should reset stack
  let resetStack = false;
  if (location.action === HISTORY_REPLACE) {
    resetStack = true;
  }

  const action: NavigationAction = {
    type,
    routes,
    location,
    params,
    nextNavigationState,
    resetStack,
  };

  return reducer(navigationState, action);
}

var _extends = Object.assign ||
  function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

export function createRouterObject(history, transitionManager, state) {
  var router = _extends({}, history, {
    setRouteLeaveHook: transitionManager.listenBeforeLeavingRoute,
    isActive: transitionManager.isActive
  });

  return assignRouterState(router, state);
}

export function assignRouterState(router, _ref) {
  var location = _ref.location,
    params = _ref.params,
    routes = _ref.routes;

  router.location = location;
  router.params = params;
  router.routes = routes;

  return router;
}
