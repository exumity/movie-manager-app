import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MovieSessionDto } from '../dto/movie-session.dto';
import { timeSlotToDate } from '../../utility';

/**
 * Constraint[0] -> Gap (minimum time slot and current time gap)
 */
@ValidatorConstraint({ name: 'doNotIncludeStartedSlots', async: false })
export class DoNotIncludeStartedSlotsValidator
  implements ValidatorConstraintInterface
{
  validate(sessions: MovieSessionDto[], args: ValidationArguments) {
    const sortedSessions = sessions.sort((a, b) => {
      if (`${a.date}${a.timeSlot}` > `${b.date}${b.timeSlot}`) return 1;
      if (`${a.date}${a.timeSlot}` === `${b.date}${b.timeSlot}`) return 0;
      return -1;
    });
    for (const sortedSession of sortedSessions) {
      if (
        Date.now() + (args.constraints[0] || 0) * 1000 >
        timeSlotToDate(
          sortedSession.date,
          sortedSession.timeSlot,
        ).startTime.getTime()
      ) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    let msg = 'Sessions must not include started slots.';
    if (args.constraints[0] > 0) {
      msg += ` Gap value: (${args.constraints[0]})`;
    }
    return msg;
  }
}
