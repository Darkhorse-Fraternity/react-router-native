/* @flow */

import React, { PropTypes, Component } from 'react';
import invariant from 'invariant';
import RootContainer from './RootContainer';

import { createNavigationTree } from './RouteUtils';

import type {
  Snapshot,
  RouteDef,
  Location,
  EnhancedNavigationRoute,
  ElementProvider,
} from './TypeDefinition';

type Props = {
  router: Object,
  location: Location,
  routes: Array<RouteDef>,
  params: Object,
  components: Array<ReactClass<any>>,
  navigationState: EnhancedNavigationRoute,
  createElement: ElementProvider,
  addressBar: boolean,

  onHardwareBackPress: (router: Object, exit: Function,state:EnhancedNavigationRoute) => boolean,

  backwardHistory: Array<Snapshot>,
  forwardHistory: Array<Snapshot>,
};

class RouterContext extends Component<any, any, any> {

  static propTypes= {
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    components: PropTypes.array.isRequired,
    navigationState: PropTypes.object.isRequired,
    createElement: PropTypes.func.isRequired,
    addressBar: PropTypes.bool,

    onHardwareBackPress: PropTypes.func,

    backwardHistory: PropTypes.array.isRequired,
    forwardHistory: PropTypes.array.isRequired,
  };

  static defaultProps = {
    createElement: React.createElement,
  };

  static childContextTypes = {
    router: PropTypes.object.isRequired,
    backwardHistory: PropTypes.array.isRequired,
    forwardHistory: PropTypes.array.isRequired,
  };

  getChildContext(): Object {
    const {
      router,
      backwardHistory,
      forwardHistory,
    } = this.props;

    return { router, backwardHistory, forwardHistory };
  }

  componentWillMount(): void {
    (this: any).createElement = this.createElement.bind(this);
  }

  props: Props;

  createElement(component: ReactClass<any>, passProps: any): ?ReactElement<any> {
    return component == null ? null : this.props.createElement(component, passProps);
  }

  render(): ?ReactElement<any> {
    const {
      routes,
      location,
      addressBar,
      onHardwareBackPress,
    } = this.props;

    const navigationTree = createNavigationTree(this.createElement, routes);
    const navigationState = this.props.navigationState;

    let element = null;

    if (navigationTree) {
      const passProps = {
        addressBar,
        navigationTree,
        navigationState,
        location,
        onHardwareBackPress,
      };

      element = React.createElement(RootContainer, passProps);
    }

    invariant(
      element === null || element === false || React.isValidElement(element),
      'The root route must render a single element'
    );

    return element;
  }
}

export default RouterContext;
