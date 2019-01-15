import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import AntdIcon from '@ant-design/icons-react'
import { GithubFill } from '@ant-design/icons'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import get from 'lodash.get'
import ZeppelinOSLogo from '~/assets/images/zep-token-logo.svg'
import * as routes from '~/../config/routes'

const eventsQuery = gql`
  query eventsQuery {
    Vouching @contract {
      registeredEvents: Registered @pastEvents(fromBlock: "0", toBlock: "latest")
    }
  }
`

const packageQuery = gql`
  query packageQuery($path: String!) {
    metadata(path: $path) @rest(path: $path) {
      id
      name
      version
      description
    }
  }
`

export class PackageItemPage extends PureComponent {
  state = {}

  // static propTypes = {
  //   package: PropTypes.object.isRequired
  // }

  handleGitHubLinkClick = (url) => {
    console.log('github link click')
    if (window) {
      window.location.href = url
    }
  }

  render () {
    console.log(this.props)
    console.log(this.props.match.params.slug)
    return (
      <Query query={eventsQuery}>
        {({ loading, error, data }) => {
          if (loading) return null
          if (error) return `Error!: ${error}`

          const events = data.Vouching ? data.Vouching.registeredEvents : []

          return (
            <>
              {
                events.map(
                  event => {
                    console.log('event', event)
                    if (event) {

                    }

                    return (
                      <Query query={packageQuery} variables={{ path: this.props.package.metadataURI }}>
                        {
                          ({ loading, error, data }) => {
                            if (loading) return null
                            if (error) return `Error!: ${error}`

                            const { metadata } = data
                            const { version } = metadata

                            return (
                              <div>
                                <h4 className='title is-size-4'>
                                  {get(metadata, 'name')}

                                  <span className="package-list-item--version has-text-grey has-text-weight-light">
                                    v{get(metadata, 'version')}
                                  </span>
                                </h4>
                                <code className="code--quick-install">
                                  $ zos link {get(metadata, 'name')}
                                </code>
                                <button
                                  className="package-list-item--github-icon is-text button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()

                                    // this should be coming from the json data
                                    const url = "https://github.com/DeltaCamp/zeppelin-vouching-app"

                                    this.handleGitHubLinkClick(url)
                                  }}
                                >
                                  <AntdIcon type={GithubFill} className="antd-icon" />
                                </button>

                                <h6 className='subtitle is-size-7 package-list-item--subtitle'>
                                  VOUCHED
                                </h6>

                                <span className='is-inline-block'>
                                  <ZeppelinOSLogo width='20' height='20' className='package-list-item--zep-token-logo' />
                                </span>

                                <h3 className='is-inline-block is-size-3 has-text-weight-light'>
                                  4,000
                                </h3>
                              </div>
                            )
                          }
                        }
                      </Query>
                    )
                  }

                )
              }
            </>
          )
        }}
      </Query>
    )
  }
}
