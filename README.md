# paged-array

paged-array is an extension of the basic array class. Enables paging by default and give you tools to make large and lazy data processing easier.

## Why pagination?
Sometimes the system has too much data to work at the same time. Its not wise, for example, loading one hundred megabytes of information inside an array. If you are processing lists of files in your machine or http services on the web this can easily happen.

## Lazy processing
Instead of running your memory hungry function and put the results in a huge array paged-array takes your input + function that receives the input. Each time the method load is used the function is executed for each member in that page.

## Example

- [Api of ice and fire](https://github.com/lourencomcviana/paged-array/blob/master/examples/http/api-of-ice-and-fire/README.md):
  Use paged-array to manage one http api

## Compatibility
The transpiled objects only work with ecmascript 6. It is possible that i could make it compatible with ecmascript 5 but only if someone truly wants it.
