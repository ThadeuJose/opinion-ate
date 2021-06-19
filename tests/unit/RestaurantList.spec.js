import {mount, createLocalVue} from '@vue/test-utils';
import RestaurantList from '@/components/RestaurantList';
import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

describe('RestaurantList', () => {
  Vue.use(Vuetify);

  const records = [
    {id: 1, name: 'Sushi Place'},
    {id: 2, name: 'Pizza Place'},
  ];

  const vuetify = new Vuetify();
  const localVue = createLocalVue();
  localVue.use(Vuex);

  let restaurantsModule;
  let wrapper;

  const mountWithStore = (state = {records, loading: false}) => {
    restaurantsModule = {
      namespaced: true,
      state,
      actions: {
        load: jest.fn().mockName('load'),
      },
    };

    const store = new Vuex.Store({
      modules: {
        restaurants: restaurantsModule,
      },
    });

    wrapper = mount(RestaurantList, {localVue, store, vuetify});
  };

  it('loads restaurants on mount', () => {
    mountWithStore();
    expect(restaurantsModule.actions.load).toHaveBeenCalled();
  });

  describe('when loading fails', () => {
    beforeEach(() => {
      mountWithStore({loadError: true});
    });

    it('display the error message', () => {
      expect(wrapper.find('[data-testid="loading-error"]').exists()).toBe(true);
    });
  });

  describe('when loading suceeds', () => {
    beforeEach(() => {
      mountWithStore();
    });

    it('does not displays the loading indicator while not loading', () => {
      expect(wrapper.find('[data-testid="loading-indicator"]').exists()).toBe(
        false,
      );
    });

    it('does not display the error message', () => {
      expect(wrapper.find('[data-testid="loading-erro"]').exists()).toBe(false);
    });

    it('displays the restaurants', () => {
      const firstRestaurantName = wrapper
        .findAll('[data-testid="restaurant"]')
        .at(0)
        .text();

      expect(firstRestaurantName).toBe('Sushi Place');

      const secondRestaurantName = wrapper
        .findAll('[data-testid="restaurant"]')
        .at(1)
        .text();

      expect(secondRestaurantName).toBe('Pizza Place');
    });
  });

  it('displays the loading indicator while loading', () => {
    mountWithStore({loading: true});
    expect(wrapper.find('[data-testid="loading-indicator"]').exists()).toBe(
      true,
    );
  });
});
