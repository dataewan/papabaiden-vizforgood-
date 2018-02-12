import React from 'react'

import './Story.css'

class Story extends React.Component {
  render() {
    const { changeregion, change, highlightTS, highlightRSTS } = this.props;
    return (
      <div className='story'>
        <p>
          There are an estimated <span 
            className='ul' 
            onMouseEnter={d => change('Totalroughsleepercountestimate')}
          >4,134</span> people sleeping rough in England in 2016.
          This is around <span 
            className='ul' 
            onMouseEnter={d => change('RSRate')}
          >0.2</span> people sleeping rough for every 1000 households.
        </p>
        <p>
          The number of rough sleepers has increased from <span
            className='ul'
            onMouseEnter={d => highlightTS(true)}
            onMouseLeave={d => highlightTS(false)}
          >1,768 to 4,134</span> between 2010 and 2016,
          increasing most significantly since 2014.
          This trend looks like it will continue.
        </p>
        <p>
          At the same time, there is a significant stock of vacant properties in England.
          There are <span
            className='ul'
            onMouseEnter={d => highlightRSTS(true)}
            onMouseLeave={d => highlightRSTS(false)}
          >close to 600,000 vacants</span>, or 140 vacants for every person sleeping rough.
          It is massively oversimplifying things to put these numbers next to each other,
          but it does show that there are things that we can do -- the scale isn't overwhelming.
        </p>
        <hr />
        <p>
          We often associate rough sleeping with large urban areas.
          It is true that the big cities of <span
            className='ul'
            onMouseEnter={d => changeregion("E08000003")}
          >Manchester</span>, <span
            className='ul'
            onMouseEnter={d => changeregion("E08000025")}
          >Birmingham</span>, and areas like <span
            className='ul'
            onMouseEnter={d => changeregion("E09000033")}
          >Westminster</span>, and <span
            className='ul'
            onMouseEnter={d => changeregion("E09000008")}
          >Croydon</span> in London have large numbers of people sleeping rough.
          Note though that less populous regions like <span
            className='ul'
            onMouseEnter={d => changeregion("E06000052")}
          >Cornwall</span>, <span
            className='ul'
            onMouseEnter={d => changeregion("E06000055")}
          >Bedford</span>, and <span
            className='ul'
            onMouseEnter={d => changeregion("E07000146")}
          >King's Lynn</span> also rank highly.
        </p>
        <p>
          A particularly compelling story is <span
            className='ul'
            onMouseEnter={d => changeregion("E06000043")}
          >Brighton and Hove</span>.
          The increase in rough sleeping in Brighton is striking, and has been reported in <a href="http://www.theargus.co.uk/news/15052321.Homeless_rates_hit_a_record_high_in_Brighton_and_Hove/">local media</a>.
          There has been a ten-fold increase in the number of people sleeping rough here since 2010,
          and now has the second highest rough sleeping population in the country.
          There are large numbers of <span 
            className='ul' 
            onMouseEnter={d => change('Under25yearsold')}
          >people under 25</span> (second highest in the country), and large numbers of <span 
            className='ul' 
            onMouseEnter={d => change('Female')}
          >female</span> rough sleepers (highest in the country).
          This is at the same time that the number of vacant houses have increased.
        </p>
        <p>
          This is an issue that affects the whole country, and all members of our society.
        </p>
        <hr />
        <p>
          As striking as these numbers are, they will tend to underestimate the volume of people without a home.
          The figures used in this report come from official government statistics.
          An alternative source comes from the Combined Homelessness and Information Network (CHAIN) report distributed by <a href="https://www.mungos.org/">St Mungos</a>.
          Funded by the Greater London Authority (GLA),
          it only gives information for London.
          The CHAIN report is a record of work done year-round in London,
          rather than the snapshot that the UK government figures give.
        </p>
        <p>
          In the UK government figures for 2014 we record 742 people sleeping rough in London.
          In the <a href="https://www.mungos.org/wp-content/uploads/2017/07/chain_street_to_home_annual_report_2013-14.pdf">more comprehensive CHAIN report</a>, <b>6,508</b> people are recorded.
          There is a huge discrepancy between the central government figures, and the CHAIN figures.
        </p>
      </div>
    );
  }
}


export default Story
