import * as chai from 'chai'
const expect = chai.expect

import * as React from 'react'
import { shallow } from 'enzyme'

import { RichText } from '../../../src/ui/lib/rich-text'

describe('RichText', () => {
  const emoji = new Map<string, string>([ [ ':shipit:', '/some/path.png' ] ])

  function createComponent(children: string, linkClicked?: () => void) {
    return shallow(
      <RichText emoji={emoji} children={children} linkClicked={linkClicked} />
    )
  }

  describe('with GitHub repository', () => {

    const linkClicked = () => { }

    it('renders emoji when matched', () => {
      const children = 'releasing the thing :shipit:'
      const wrapper = createComponent(children, linkClicked)
      const links = wrapper.find('.emoji')
      expect(links.length).to.equal(1)
    })

    it('skips emoji when no match exists', () => {
      const children = 'releasing the thing :unknown:'
      const wrapper = createComponent(children, linkClicked)
      const links = wrapper.find('.emoji')
      expect(links.length).to.equal(0)
    })

    it('does not render hyperlink when email address found', () => {
      const children = 'the email address support@github.com should be ignored'
      const wrapper = createComponent(children, linkClicked)
      const links = wrapper.find('.username')
      expect(links.length).to.equal(0)
    })

    it('render hyperlink when starting with a @', () => {
      const children = '@shiftkey was here'
      const wrapper = createComponent(children, linkClicked)
      const links = wrapper.find('.username')
      expect(links.length).to.equal(1)
    })

    it('renders hyperlink when a mention is found', () => {
      const children = 'fixed based on suggestion from @shiftkey'
      const wrapper = createComponent(children, linkClicked)
      const links = wrapper.find('.username')
      expect(links.length).to.equal(1)
    })

    it('renders hyperlink when an issue reference is found', () => {
      const children = 'Merge pull request #955 from desktop/computering-icons-for-all'
      const wrapper = createComponent(children, linkClicked)
      const links = wrapper.find('.issue')
      expect(links.length).to.equal(1)
    })
  })

  describe('with non-GitHub repository', () => {
    it('renders emoji when matched', () => {
      const children = 'releasing the thing :shipit:'
      const wrapper = createComponent(children)
      const links = wrapper.find('.emoji')
      expect(links.length).to.equal(1)
    })

    it('skips emoji when no match exists', () => {
      const children = 'releasing the thing :unknown:'
      const wrapper = createComponent(children)
      const links = wrapper.find('.emoji')
      expect(links.length).to.equal(0)
    })

    it('does not render hyperlink for mention', () => {
      const children = 'fixed based on suggestion from @shiftkey'
      const wrapper = createComponent(children)
      const links = wrapper.find('.username')
      expect(links.length).to.equal(0)
    })

    it('does not render hyperlink for issue reference', () => {
      const children = 'Merge pull request #955 from desktop/computering-icons-for-all'
      const wrapper = createComponent(children)
      const links = wrapper.find('.issue')
      expect(links.length).to.equal(0)
    })
  })
})
