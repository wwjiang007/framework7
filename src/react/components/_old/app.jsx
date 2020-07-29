import Utils from '../shared/utils';
import Mixins from '../shared/mixins';
import f7 from '../shared/f7';
import RoutableModals from './routable-modals';

/* phenome-dts-imports
import { Framework7Params } from 'framework7/components/app/app-class';
import { Router } from 'framework7/modules/router/router';
*/

export default {
  name: 'f7-app',
  props: {
    id: [String, Number],
    className: String, // phenome-react-line
    style: Object, // phenome-react-line
    params: Object,
    routes: Array,
    /* phenome-react-dts-props
    params?: Framework7Params
    routes?: Router.RouteParameters[]
    */
    ...colorProps,
  },
  render() {
    const self = this;
    const props = self.props;
    const {
      id,
      style,
      className,
    } = props;

    const classes = classNames(
      className,
      'framework7-root',
      colorClasses(props),
    );

    return (
      <div ref="el" id={id || 'framework7-root'} style={style} className={classes}>
        <slot />
        <RoutableModals />
      </div>
    );
  },
  componentDidMount() {
    const self = this;
    const { params = {}, routes } = self.props;
    const el = self.refs.el;
    const parentEl = el.parentNode;

    if (parentEl && parentEl !== document.body && parentEl.parentNode === document.body) {
      parentEl.style.height = '100%';
    }
    if (f7.instance) return;
    f7.init(el, params, routes);
  },
};