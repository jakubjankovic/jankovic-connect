export interface FollowUpInput {
  name: string;
  place: string;
  topic: string;
  nextStep: string;
}

/**
 * Generates a short, warm, professional Slovak follow-up message.
 * Tone: human, not pushy, not salesy. Parts gracefully omit when empty.
 */
export function generateFollowUp(input: FollowUpInput): string {
  const name = input.name.trim();
  const place = input.place.trim();
  const topic = input.topic.trim();
  const nextStep = input.nextStep.trim();

  const greeting = name ? `Dobrý deň, ${name},` : 'Dobrý deň,';

  const met = place
    ? `rád som Vás spoznal na ${place}.`
    : 'rád som Vás spoznal.';

  const thanks = topic
    ? `Ďakujem za príjemný rozhovor o ${topic}.`
    : 'Ďakujem za príjemný rozhovor.';

  const next = nextStep
    ? `${nextStep} Budem rád, ak zostaneme v kontakte.`
    : 'Budem rád, ak zostaneme v kontakte.';

  const closing = 'Prajem Vám pekný deň,\nJakub';

  return `${greeting} ${met} ${thanks} ${next}\n\n${closing}`;
}
