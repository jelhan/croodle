import Component from "@glimmer/component";
import { DateTime } from "luxon";

export default class PollEvaluationParticipantsTable extends Component {
  get optionsPerDay() {
    const { poll } = this.args;

    const optionsPerDay = new Map();
    for (const option of poll.options.toArray()) {
      optionsPerDay.set(
        option.day,
        optionsPerDay.has(option.day) ? optionsPerDay.get(option.day) + 1 : 0
      );
    }

    return new Map(
      optionsPerDay
        .entries()
        .map(([dayString, count]) => [
          DateTime.fromISO(dayString).toJSDate(),
          count,
        ])
    );
  }

  get usersSorted() {
    const { poll } = this.args;
    return poll.users.toArray().sort((a, b) => a.creationDate > b.creationDate ? 1 : -1);
  }
}
