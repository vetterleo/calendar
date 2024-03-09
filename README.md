# VetCalendar

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.2.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Usage

Use the directive `vet-calendar` on your input as such `<input vetCalendarDir>` to use the date picker.
The directive accept three input `noFuture`, `startRange`, `endRange` and `format`.

The input `noFuture` tell the date picker that the dates in the future cannot be selected.

The input `startRange` and `endRange` tell the date picker that only the dates in the range can be selected.
The format of the `startRange` and `endRange` must be of the form `YYYY-MM-DD`. An error is thrown if it is not the case.

The input `format` tell the date picker how to format the date in the input

