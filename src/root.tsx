import React from 'react';
import {Composition} from 'remotion';
import {TalentStreamV4} from './talentstream-v4';
import {TalentStreamOpeningV2} from './talentstream-opening-v2';
import {CoffeemiumFiverr} from './coffeemium-fiverr';
import {WordbasePortfolioV2, WordbasePortfolioV3} from './wordbase-portfolio-v2';
import {OpenAIAnnouncement} from './openai-announcement';
import {OpenAIAnnouncementV2} from './openai-announcement-v2';

export const Root: React.FC = () => <>
  <Composition id="TalentStreamOpening" component={TalentStreamOpeningV2} durationInFrames={180} fps={30} width={1920} height={1080}/>
  <Composition id="TalentStreamV4" component={TalentStreamV4} durationInFrames={1860} fps={30} width={1920} height={1080}/>
  <Composition id="CoffeemiumFiverr" component={CoffeemiumFiverr} durationInFrames={1480} fps={30} width={1920} height={1080}/>
  <Composition id="WordbasePortfolio" component={WordbasePortfolioV3} durationInFrames={2287} fps={30} width={1920} height={1080}/>
  <Composition id="WordbasePortfolioV2" component={WordbasePortfolioV2} durationInFrames={1891} fps={30} width={1920} height={1080}/>
  <Composition id="OpenAIAnnouncementV2" component={OpenAIAnnouncementV2} durationInFrames={4247} fps={30} width={1080} height={1350}/>
  <Composition id="OpenAIAnnouncement" component={OpenAIAnnouncement} durationInFrames={4247} fps={30} width={1080} height={1350}/>
</>;
