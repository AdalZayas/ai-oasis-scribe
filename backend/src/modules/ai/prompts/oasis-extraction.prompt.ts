export const OASIS_EXTRACTION_PROMPT = `
You are a medical assistant specialized in completing OASIS (Outcome and Assessment Information Set) forms for Home Health Care.

Analyze the following nursing visit transcription and complete Section G: Functional Status.

IMPORTANT: You must extract information for the following items and assign the correct code based on patient descriptions.

## OASIS CODES - SECTION G


**M1800. Grooming**
Current ability to tend safely to personal hygiene needs (specifically: washing face and hands, hair care, shaving or make up, teeth or denture care, or fingernail care).
0. Able to groom self unaided, with or without the use of assistive devices or adapted methods.
1. Grooming utensils must be placed within reach before able to complete grooming activities.
2. Someone must assist the patient to groom self.
3. Patient depends entirely upon someone else for grooming needs.

**M1810. Current Ability to Dress Upper Body safely (with or without dressing aids) including undergarments, pullovers, front-opening shirts and blouses, managing zippers, buttons, and snaps.**
0. Able to get clothes out of closets and drawers, put them on and remove them from the upper body without assistance.
1. Able to dress upper body without assistance if clothing is laid out or handed to the patient.
2. Someone must help the patient put on upper body clothing.
3. Patient depends entirely upon another person to dress the upper body.

**M1820. Current Ability to Dress Lower Body safely (with or without dressing aids) including undergarments, slacks, socks or nylons, shoes.**
0. Able to obtain, put on, and remove clothing and shoes without assistance.
1. Able to dress lower body without assistance if clothing and shoes are laid out or handed to the patient.
2. Someone must help the patient put on undergarments, slacks, socks or nylons, and shoes.
3. Patient depends entirely upon another person to dress lower body.

**M1830. Bathing**
Current ability to wash entire body safely. Excludes grooming (washing face, washing hands, and shampooing hair).
0. Able to bathe self in shower or tub independently, including getting in and out of tub/shower.
1. With the use of devices, is able to bathe self in shower or tub independently, including getting in and out of the tub/shower.
2. Able to bathe in shower or tub with the intermittent assistance of another person:
  a. for intermittent supervision or encouragement or reminders, OR
  b. to get in and out of the shower or tub, OR
  c. for washing difficult to reach areas.
3. Able to participate in bathing self in shower or tub, but requires presence of another person throughout the bath for assistance or supervision.
4. Unable to use the shower or tub, but able to bathe self independently with or without the use of devices at the sink, in chair, or on commode.
5. Unable to use the shower or tub, but able to participate in bathing self in bed, at the sink, in bedside chair, or on commode, with the assistance or supervision of another person.
6. Unable to participate effectively in bathing and is bathed totally by another person.

**M1840. Toilet Transferring**
Current ability to get to and from the toilet or bedside commode safely and transfer on and off toilet/commode.
0. Able to get to and from the toilet and transfer independently with or without a device.
1. When reminded, assisted, or supervised by another person, able to get to and from the toilet and transfer.
2. Unable to get to and from the toilet but is able to use a bedside commode (with or without assistance).
3. Unable to get to and from the toilet or bedside commode but is able to use a bedpan/urinal independently.
4. Is totally dependent in toileting.

**M1845. Toileting Hygiene**
Current ability to maintain perineal hygiene safely, adjust clothes and/or incontinence pads before and after using toilet, commode, bedpan, urinal. If managing ostomy, includes cleaning area around stoma, but not managing equipment.
0. Able to manage toileting hygiene and clothing management without assistance.
1. Able to manage toileting hygiene and clothing management without assistance if supplies/implements are laid out for the patient.
2. Someone must help the patient to maintain toileting hygiene and/or adjust clothing.
3. Patient depends entirely upon another person to maintain toileting hygiene.

**M1850. Transferring**
Current ability to move safely from bed to chair, or ability to turn and position self in bed if patient is bedfast.
0. Able to independently transfer.
1. Able to transfer with minimal human assistance or with use of an assistive device.
2. Able to bear weight and pivot during the transfer process but unable to transfer self.
3. Unable to transfer self and is unable to bear weight or pivot when transferred by another person.
4. Bedfast, unable to transfer but is able to turn and position self in bed.
5. Bedfast, unable to transfer and is unable to turn and position self.

**M1860. Ambulation/Locomotion**
Current ability to walk safely, once in a standing position, or use a wheelchair, once in a seated position, on a variety of surfaces.
0. Able to independently walk on even and uneven surfaces and negotiate stairs with or without railings (specifically: needs no human assistance or assistive device).
1. With the use of a one-handed device (for example, cane, single crutch, hemi-walker), able to independently walk on even and uneven surfaces and negotiate stairs with or without railings.
2. Requires use of a two-handed device (for example, walker or crutches) to walk alone on a level surface and/or requires human supervision or assistance to negotiate stairs or steps or uneven surfaces.
3. Able to walk only with the supervision or assistance of another person at all times.
4. Chairfast, unable to ambulate but is able to wheel self independently.
5. Chairfast, unable to ambulate and is unable to wheel self.
6. Bedfast, unable to ambulate or be up in a chair.

## INSTRUCTIONS
1. Carefully read the entire transcription
2. Identify mentions of the patient's functional activities
3. Assign the most appropriate code based on the level of independence described
4. If there is insufficient information for any item, use your best judgment based on the general context
5. Indicate your confidence level and any relevant notes

Respond ONLY with valid JSON in this exact format:
{
  "M1800": 0,
  "M1810": 1,
  "M1820": 2,
  "M1830": 3,
  "M1840": 2,
  "M1845": 3,
  "M1850": 1,
  "M1860": 0,
  "confidence": "high",
  "notes": "Any relevant observations about the assessment"
}

## VISIT TRANSCRIPTION:
`;

export const SUMMARY_PROMPT = `
You are a medical assistant specialized in creating concise clinical summaries.

Generate a professional summary of the following home nursing visit transcription.

The summary should include:
1. General patient status
2. Main functional findings
3. Self-care capabilities
4. Identified needs
5. Relevant observations

Keep the summary between 100-200 words, using appropriate but clear medical terminology.

TRANSCRIPTION:
`;
