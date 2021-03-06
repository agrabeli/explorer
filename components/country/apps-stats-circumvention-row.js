import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box } from 'ooni-components'
import styled from 'styled-components'
import MdArrowDropDownCircle from 'react-icons/lib/md/arrow-drop-down-circle'
import {
  NettestWhatsApp
} from 'ooni-components/dist/icons'
import moment from 'moment'

import { testNames } from '../test-info'

const NETWORK_STATS_PER_PAGE = 4

const StyledRow = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray3};
`

const NetworkRow = ({ asn, data }) => (
  <Box width={1} mb={3}>
    <Flex alignItems='center'>
      <Box width={1/3} pl={4}>
        <strong>AS{ asn }</strong>
      </Box>
      <Box width={2/3}>
        <Box mb={1}>{data.last_tested} Last tested</Box>
        <Flex mb={1}>
          <Box width={1/3}>
            {data.failure_count} Not OK
          </Box>
          <Box width={1/3}>
            {data.success_count} OK
          </Box>
          <Box width={1/3}>
            {data.total_count} Total
          </Box>
        </Flex>
        <Flex>
          <Box width={1/3}>
            {data.test_runtime_avg} Runtime avg
          </Box>
          <Box width={1/3}>
            {data.test_runtime_max} Runtime max
          </Box>
          <Box width={1/3}>
            {data.test_runtime_min} Runtime min
          </Box>
        </Flex>
      </Box>
    </Flex>
  </Box>
)

class AppsStatsCircumventionRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      minimized: true,
      visibleNetworks: 0
    }
    this.toggleMinimize = this.toggleMinimize.bind(this)
    this.showMore = this.showMore.bind(this)
  }

  toggleMinimize() {
    const { totalNetworks } = this.state
    const networksToShow = Math.min(totalNetworks, NETWORK_STATS_PER_PAGE)
    this.setState((state) => ({
      minimized: !state.minimized,
      visibleNetworks: state.minimized ? networksToShow : 0
    }))
  }

  showMore() {
    // Ensure not to add more rows than available
    const { visibleNetworks, totalNetworks } = this.state

    let rowsToAdd = NETWORK_STATS_PER_PAGE

    if (visibleNetworks + NETWORK_STATS_PER_PAGE > totalNetworks) {
      rowsToAdd = totalNetworks - visibleNetworks
    }

    this.setState((state) => ({
      visibleNetworks: state.visibleNetworks + rowsToAdd
    }))
  }


  static getDerivedStateFromProps(props, state) {
    const totalNetworks = props.data.networks.length
    return {
      totalNetworks,
      ...state
    }
  }

  renderCharts() {
    const { data } = this.props
    const { totalNetworks, visibleNetworks } = this.state
    const networks = data.networks
    const content = []

    for (let i = 0; i < networks.length && i < visibleNetworks ; i ++) {
      content.push(<NetworkRow key={networks[i].probe_asn} asn={networks[i].probe_asn} data={networks[i]} />)
    }

    return (
      <React.Fragment>
        <Flex flexWrap='wrap'>
          {content}
        </Flex>
        {(visibleNetworks < totalNetworks) &&
          <Flex justifyContent='center'>
            <a href='javascript:void(0)' onClick={() => this.showMore()}>
              <FormattedMessage id='Country.Apps.Button.ShowMore' />
            </a>
          </Flex>
        }
      </React.Fragment>
    )
  }

  render () {
    const { data } = this.props
    const { minimized } = this.state
    console.log('my props', this.props)
    return (
      <StyledRow px={2} py={3}>
        <Flex flexWrap='wrap' alignItems='center'>
          <Box width={4/12}>
            <NettestWhatsApp size={36} />
            Vanilla Tor
          </Box>
          <Box width={4/12}>
            {`${data.notok_networks} / ${data.networks.length} Networks`}
          </Box>
          <Box width={3/12}>
            <FormattedMessage id='Country.Apps.Label.LastTested' />
            {' '}
            <strong>{moment(data.last_tested).fromNow()}</strong>
          </Box>
          <Box width={1/12}>
            <MdArrowDropDownCircle size={19} onClick={this.toggleMinimize} />
          </Box>
        </Flex>
        {!minimized && this.renderCharts()}
      </StyledRow>
    )
  }
}

export default AppsStatsCircumventionRow
