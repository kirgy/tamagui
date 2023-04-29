import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Compilers will free us all"
      subTitle="Less code + better performance = better experiences"
      theme="pink"
      steps={[
        [
          {
            type: 'image',
            image: require('../images/trilemma.svg').default,
          },
        ],
      ]}
    />
  )
})
