import React from 'react'
import ReactDOM from 'react-dom'
import App, { Link } from './App'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'

configure({ adapter: new Adapter() })

describe('<App /> using shallow rendering', () => {
  it('h1 contains correct text', () => {
    const wrapper = shallow(<App/>)
    expect(wrapper.find('h1').text()).toBe('Welcome to React');
  })

  it('should match the snapshot', () => {
    const tree = shallow(<App/>)
    expect(toJson(tree)).toMatchSnapshot()
  })

  it('should update className with new State', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find('.blue').length).toBe(1)
    expect(wrapper.find('.red').length).toBe(0)
    wrapper.setState({ mainColor: 'red' })
    expect(wrapper.find('.blue').length).toBe(0)
    expect(wrapper.find('.red').length).toBe(1)

  })

  it('should change p text on button click', () => {
    const wrapper = shallow(<App />)
    const button = wrapper.find('button')
    expect(wrapper.find('.button-state').text()).toBe('No!')
    button.simulate('click')
    expect(wrapper.find('.button-state').text()).toBe('Yes!')
  })

  it('should update title text on input change', () => {
    const wrapper = shallow(<App />)
    const input = wrapper.find('input')
    expect(wrapper.find('h2').text()).toBe('')
    input.simulate('change', {  currentTarget: { value: 'evoke.io' } })
    expect(wrapper.find('h2').text()).toBe('evoke.io')
  })

  it('should call componentDidMount', () => {
    jest.spyOn(App.prototype, 'componentDidMount')
    const wrapper = shallow(<App />)
    expect(App.prototype.componentDidMount.mock.calls.length).toBe(1)
    expect(wrapper.find('.lifeCycle').text()).toBe('componentDidMount')
  })

  it('should call componentWillReceiveProps on setProps', () => {
    jest.spyOn(App.prototype, 'componentWillReceiveProps')
    const wrapper = shallow(<App />)
    wrapper.setProps({ hide: true })
    expect(App.prototype.componentWillReceiveProps.mock.calls.length).toBe(1)
    expect(wrapper.find('.lifeCycle').text()).toBe('componentWillReceiveProps')
  })

  it('should correctly handleStrings', () => {
    const wrapper = shallow(<App />)
    const trueReturn = wrapper.instance().handleStrings('Hello World')
    const falseReturn = wrapper.instance().handleStrings('any other returns false')
    expect(trueReturn).toBe(true)
    expect(falseReturn).toBe(false)
  })

})

describe('<App /> mount rendering', () => {
  it('h1 contains correct text', () => {
    const wrapper = mount(<App/>)
    expect(wrapper.find('h1').text()).toBe('Welcome to React')
    //wrapper.unmount()
  })

  it('should match the snapshot', () => {
    const tree = mount(<App/>)
    expect(toJson(tree)).toMatchSnapshot()
    //tree.unmount()
  })
})

describe('<Link />', () => {
  it('should accept address prop', () => {
    const wrapper = shallow(<Link address='www.google.com' />)
    expect(wrapper.instance().props.address).toBe('www.google.com');
  })

  it('should render href correctly', () => {
    const wrapper = shallow(<Link address='www.google.com' />)
    expect(wrapper.props().href).toBe('www.google.com');
  })

  it('should return null with true hide prop', () => {
    const wrapper = shallow(<Link hide={false} />)
    expect(wrapper.find('a').length).toBe(1)
    wrapper.setProps({ hide: true })
    expect(wrapper.get(0)).toBeNull()
  })
})