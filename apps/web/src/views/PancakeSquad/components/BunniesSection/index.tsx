import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'
import { LandingBodyWrapper } from 'views/PancakeSquad/styles'
import useTheme from 'hooks/useTheme'
import bunniesConfig from './config'
import { StyledBunnySectionContainer, StyledTextContainer } from './styles'
import BunniesImages from './BunniesImages'

const BunniesSection = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const { headingText, bodyText, subHeadingText, primaryButton, images } = bunniesConfig(t)

  return (
    <StyledBunnySectionContainer justifyContent={['flex-start', null, null, 'center']}>
      <LandingBodyWrapper
        pb={['64px', null, null, '0']}
        pt={['64px', null, null, '40px']}
        alignItems={['flex-end', null, 'center', null]}
        flexDirection={['column', null, null, 'row']}
      >
        <BunniesImages basePath={images.basePath} altText={images.alt} />
        <StyledTextContainer
          flexDirection="column"
          alignSelf={['flex-start', null, null, 'center']}
          width={['100%', null, null, '50%']}
        >
          {bodyText.map((text) => (
            <Text key={text} color="textSubtle" mb="20px">
              {text}
            </Text>
          ))}
          <Flex>
            <NextLinkFromReactRouter to={primaryButton.to}>
              <Button>
                <Text color="card" bold fontSize="16px">
                  {t(primaryButton.text)}
                </Text>
              </Button>
            </NextLinkFromReactRouter>
          </Flex>
        </StyledTextContainer>
      </LandingBodyWrapper>
      <Box position="absolute" bottom="-2px" width="100%" />
    </StyledBunnySectionContainer>
  )
}

export default BunniesSection
