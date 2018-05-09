import { types, getParent, getEnv, flow } from 'mobx-state-tree';
import isMatch from 'lodash/isMatch';
import requestNextPageInList from './requestNextPageInList';
import requestNextPageInSingle from './requestNextPageInSingle';
import Menu from './menu';
import Cookies from './cookies';
import Comments from './comments';
import Scroll from './scroll';
import Notifications from './notifications';
import Share from './share';

export default types
  .model('Saturn')
  .props({
    menu: types.optional(Menu, {}),
    cookies: types.optional(Cookies, {}),
    comments: types.optional(types.map(types.map(Comments)), {}),
    scroll: types.optional(Scroll, {}),
    notifications: types.optional(Notifications, {}),
    share: types.optional(Share, {}),
  })
  .views(self => ({
    get connection() {
      return getParent(self).connection;
    },
    get settings() {
      return getParent(self).settings;
    },
    get listsFromMenu() {
      return self.settings.theme.menu
        .filter(({ type }) => ['latest', 'category', 'tag', 'author'].includes(type))
        .map(list => ({
          id: parseInt(list[list.type], 10) || 'post',
          type: list.type,
          title: list.label,
        }));
    },
    getSlotsForItem({ type, id, page }) {
      return (self.settings.theme.slots || [])
        .filter(
          ({ rules }) => !!rules.item && rules.item.some(rule => isMatch({ type, id, page }, rule)),
        )
        .sort((a, b) => b.position - a.position);
    },
    getSlotsForColumn({ type, index }) {
      return (self.settings.theme.slots || [])
        .filter(
          ({ rules }) =>
            !!rules.column && rules.column.some(rule => isMatch({ type, index }, rule)),
        )
        .sort((a, b) => b.position - a.position);
    },
  }))
  .actions(requestNextPageInList)
  .actions(requestNextPageInSingle)
  .actions(self => {
    const { store, isClient } = getEnv(self);

    return {
      requestNextPages: flow(function* requestNextPages() {
        yield self.requestFirstExtracted();

        while (true) {
          yield self.requestNextPageInSingle();
        }
      }),
      afterCreate: () => {
        if (isClient) {
          if (store)
            store.subscribe(() => {
              const action = store.getState().lastAction;

              if (self[action.type]) {
                self[action.type](action);
              }
            });

          self.requestNextPages();
        }
      },
    };
  });