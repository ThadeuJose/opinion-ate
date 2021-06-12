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

  beforeEach(() => {
    restaurantsModule = {
      namespaced: true,
      state: {records},
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
  });

  it('loads restaurants on mount', () => {
    expect(restaurantsModule.actions.load).toHaveBeenCalled();
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
