import React from 'react';

import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

import { Catalog } from '../../src/client/pages/Catalog';
import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import axios from 'axios';
import { CheckoutResponse, Order } from '../../src/common/types';

describe('Проверка API', () => {
  it('У всех продуктов есть имена', async () => {
    // const user = userEvent.setup();

    // const basename = '/hw/store';

    // const api = new ExampleApi(basename);
    // const cart = new CartApi();
    // const store = initStore(api, cart);

    // const application = (
    //   <BrowserRouter basename={basename}>
    //     <Provider store={store}>
    //       <Application />
    //     </Provider>
    //   </BrowserRouter>
    // );

    // const { container, getAllByTestId, getByRole, getByText } =
    //   render(application);

    // const catalogLink = getByRole('link', {
    //   name: /catalog/i,
    // });

    // await user.click(catalogLink);

    // await waitForElementToBeRemoved(() => getByText(/loading/i));

    // screen.logTestingPlaygroundURL();
    // const [_, product] = getAllByTestId('0');
    // console.log(product);

    const basename = '/hw/store';

    const api = new ExampleApi(basename);

    const response = await api.getProducts();

    if (response.statusText === 'OK') {
      const products = response.data;
      products.forEach((element) => {
        expect(element.name).toBeDefined();
      });
    }
  });

  it('Заказ корректно добавляется', async () => {
    const basename = '/hw/store';

    const api = new ExampleApi(basename);
    const checkoutResponse = await api.checkout(
      {
        name: 'test',
        phone: '123',
        address: 'test',
      },
      {}
    );

    const id = checkoutResponse.data.id;

    const response = await axios.get<{ id: number }[]>(
      `${basename}/api/orders`
    );
    if (response.statusText === 'OK') {
      const orders = response.data;
      expect(orders.find((order) => order.id === id)).toBeDefined();
    }
  });

  it('При запросе товара по id возвращается корректный товар', async () => {
    const basename = '/hw/store';

    const api = new ExampleApi(basename);
    for (let i = 0; i < 27; i++) {
      const requestId = i;
      const response = await api.getProductById(requestId);
      expect(response.data.id).toBe(requestId);
    }
  });
});
