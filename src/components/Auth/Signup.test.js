import React from 'react'
import Signup from './Signup'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import api from '../../api'

configure({ adapter: new Adapter() })

const updateInput = (wrapper, instance, newValue) => {
  const input = wrapper.find(instance)
  input.simulate('change', {
    currentTarget: {value: newValue}
  })
  return wrapper.find(instance);
}

describe('<Form />', () => {
  // opted in by default
  test('should receive promotions by defaul', () => {
    const wrapper = shallow(<Signup/>)
    const promotionInput = wrapper.find('[data-testid="checked"]')
    expect(promotionInput.props().checked).toBe(true);
  })
  // actually input their info
  test('should allow user to fill out form', () => {
    const wrapper = shallow(<Signup />)
    const nameInput = updateInput(wrapper, '[data-testid="name"]', 'Admin')
    const emailInput = updateInput(wrapper, '[data-testid="email"]', 'admin@evoke.io')
    const numberInput = updateInput(wrapper, '[data-testid="number"]', '18885551234')
    wrapper.find('[data-testid="checked"]').simulate('click');

    expect(nameInput.props().value).toBe('Admin');
    expect(emailInput.props().value).toBe('admin@evoke.io');
    expect(numberInput.props().value).toBe('18885551234');
    expect(wrapper.find('[data-testid="checked"]').props().checked).toBe(false)
  })
  // submit form, calls api
  test('should submit the form', () => {
    jest.spyOn(api, 'addUser').mockImplementation(() => Promise.resolve({data: 'New User Added'}))
    const wrapper = shallow(<Signup />)
    updateInput(wrapper, '[data-testid="name"]', 'Admin')
    updateInput(wrapper, '[data-testid="email"]', 'admin@evoke.io')
    updateInput(wrapper, '[data-testid="number"]', '18885551234')
    wrapper.find('[data-testid="addUserForm"]').simulate('submit', { preventDefault: () => {} });

    expect(api.addUser).toHaveBeenCalledWith('Admin', 'admin@evoke.io', '18885551234')

  })
  // matches snapshot
  test('should match snapshot', () => {
    const wrapper = shallow(<Signup/>)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})