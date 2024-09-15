# react-native-ping-android

Expose the Internet Control Message Protocol (**ICMP**) to React Native android app.  
Measure the round-trip time (RTT) by using ICMP echo request packets to the intended destination.

## Installation
    npm install react-native-ping-android
🚀 This library is supported in New Architecture (Turbo Modules)

## APIs
### ICMP
A bare JavaScript class to use ICMP controller. Good to hear that this module is using [Kotlin Coroutines](https://kotlinlang.org/docs/coroutines-overview.html).
#### - Constructors: (data: ICMPConstructorDataInterface)
| Data Properties | Type                              | Required  | Default Value | Remarks                                                                            |
| --------------- | --------------------------------- | --------- | ------------- | ---------------------------------------------------------------------------------- |
| **host**        | `string`                          | Yes       |               | valid host, e.g. 1.1.1.1 or guthib.com. Invalid host or unknown service will return ping result with `PingStatus.INVALID_ARG` or `PingStatus.UNKNOWN_HOST`                                                                                                                                              |
| **packetSize**  | `number` \| `null` \| `undefined` | No        | 56            | in bytes                                                                           |
| **timeout**     | `number` \| `null` \| `undefined` | No        | 1000          | in milliseconds                                                                    |
| **ttl**         | `number` \| `null` \| `undefined` | No        | 54            | [time-to-live](https://www.cloudflare.com/learning/cdn/glossary/time-to-live-ttl/) |

#### - Methods
| Method         | Return                         | Remarks                                                                                                               |
| -------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **ping**       | `Promise<ICMPResultInterface>` | Run the ICMP ping with arguments that has been defined from constructor. This method will return with `PingStatus.ECHOING` status if the method is invoked again while the previous process is still running.                                                                                                                                        |
| **cancel**     | `void`                         | Cancel current ICMP request. This method returns nothing. However the `ping` method which invoked before will return `PingStatus.CANCELLED` status. This method does nothing if there is no ICMP requests running.                                                                                                                                     |

#### - Properties
| Property            | Type                      |
| ------------------- | ------------------------- |
| **host**            | `readonly` `string`       |
| **packetSize**      | `readonly` `number`       |
| **timeout**         | `readonly` `number`       |
| **ttl**             | `readonly` `number`       |

#### - Static Members
| Static Member       | Type              | Value             | Remarks                                                                       |
| ------------------- | ----------------- | ----------------- | ----------------------------------------------------------------------------- |
| **NO_ECHOTTL**      | number            | -1                | Just an constant whenever the status of ping result is not `PingStatus.ECHO`  |

This API doesn't provide the count and interval functional arguments like in Windows or Darwin/Linux terminal.  
If you want those, you can use the `useICMP()` React hook or you can implement your own interval and counter with this class.

## React Hooks
### useICMP
