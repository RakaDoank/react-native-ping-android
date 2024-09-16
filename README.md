# react-native-ping-android

Expose the Internet Control Message Protocol (**ICMP**) to React Native android app.  
Measure the round-trip time (RTT) by using ICMP echo request packets to the intended destination.

## Installation
    npm install react-native-ping-android

or with Yarn

    yarn add react-native-ping-android

🚀 This library is supported in New Architecture (Turbo Modules)

## APIs
### ICMP
A bare JavaScript class to use ICMP controller
```tsx
import { useRef } from 'react'
import { Button } from 'react-native'

import {
    ICMP,
    type ICMPResultInterface,
} from 'react-native-ping-android'

export default function App(): React.JSX.Element {
    const
        ref =
            useRef({
                icmp: new ICMP({ host: '1.1.1.1', packetSize: 64, timeout: 2000 }),
            }),

        [result, setResult> =
            useState<ICMPResultInterface | null>(null)

    const onPress = async () => {
        const { rtt, ttl, status } = await ref.current.icmp.ping()
        setResult({ rtt, ttl, status })
    }

    return (
        <Button
            title="Ping"
            onPress={ onPress } 
        />
    )
}
```
#### References
#### - Constructors: (data: [ICMPConstructorDataInterface](#icmpconstructordatainterface))
| Data Properties | Type                              | Required  | Default Value | Remarks                                                                            |
| --------------- | --------------------------------- | --------- | ------------- | ---------------------------------------------------------------------------------- |
| **host**        | `string`                          | Yes       |               | valid host, e.g. 1.1.1.1 or guthib.com. Invalid host or unknown service will return ping result with `PingStatus.UNKNOWN_HOST` status                                                                                                                                                                              |
| **packetSize**  | `number` \| `null` \| `undefined` | No        | 56            | in bytes                                                                           |
| **timeout**     | `number` \| `null` \| `undefined` | No        | 1000          | in milliseconds                                                                    |
| **ttl**         | `number` \| `null` \| `undefined` | No        | 54            | [time-to-live](https://www.cloudflare.com/learning/cdn/glossary/time-to-live-ttl/) |

#### - Methods
| Method         | Return                                                          | Remarks                                                                                                               |
| -------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **ping**       | [`Promise<ICMPResultInterface>`](#icmpresultinterface) | Run the ICMP ping with arguments that has been defined from constructor. This method will return with `PingStatus.ECHOING` status if the method is invoked again while the previous process is still running.                                                                                                                                                 |
| **cancel**     | `void`                         | Cancel current ICMP request. This method returns nothing. However the `ping` method which invoked before will return `PingStatus.CANCELLED` status. This method does nothing if there is no ICMP requests running.                                                                                                                                                              |

#### - Properties
| Property            | Type                      |
| ------------------- | ------------------------- |
| **host**            | `readonly` `string`       |
| **packetSize**      | `readonly` `number`       |
| **timeout**         | `readonly` `number`       |
| **ttl**             | `readonly` `number`       |

#### - Static Members
| Static Member       | Type              | Value             | Remarks                                                                                                     |
| ------------------- | ----------------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **NO_ECHO_RTT**     | `number`          | -1                | Just an constant whenever the status of ping result is not `PingStatus.ECHO`. It is used in the rtt result. |
| **NO_ECHO_TTL**     | `number`          | -1                | Just an constant whenever the status of ping result is not `PingStatus.ECHO`. It is used in the ttl result. |

This API doesn't provide the count and interval functional arguments like in Windows/Darwin/Linux terminal.  
If you want those, you can use the `useICMP()` React hook or you can implement your own interval and counter with this class. Feel free to create your own convinience.

It's safe to unmount the component without invoke the `cancel` method, like back to previous stack navigation, or unmount component with conditional rendering.

Good to hear that this module is using [Kotlin Coroutines](https://kotlinlang.org/docs/coroutines-overview.html).
# 
### useICMP
A React hook of encapsulated `ICMP` class that you can use to simplify the ping handle with the count and the interval functional, since the `ICMP` class doesn't provide those arguments.
```tsx
import { Button } from 'react-native'

import {
    useICMP,
} from 'react-native-ping-android'

export default function App(): React.JSX.Element {
    const { isRunning, result, start, stop } = useICMP()

    useEffect(() => {
        if(result) {
            console.log('Result: ', result.rtt, result.ttl, result.status)
        }
    }, [result])

    const toggle = () => {
        if(isRunning) {
            stop()
        } else {
            start({
                host: 'guthib.com',
                packetSize: 64,
                timeout: 1000,
                count: 10,
                interval: 1000,
            })
        }
    }

    return (
        <Button
            title={ isRunning ? 'Stop' : 'Start' }
            onPress={ toggle }
        />
    )
}
```
You can see full example at [/example/src/screens/ping-runner/index.tsx](https://github.com/RakaDoank/react-native-ping-android/blob/main/example/src/screens/ping-runner/index.tsx)

It's safe to unmount without invoke the `stop` method. This hook will cleanup the interval handler automatically.
```
Requirements
- Count must be larger than 0.
- Interval must be >= Timeout.

Otherwise, result will return with PingStatus.INVALID_ARG
```

#### References
#### - Returns: [UseICMPInterface](#useicmpinterface)
| Properties    | Type                              | Remarks                                                                            |
| ------------- | --------------------------------- | ---------------------------------------------------------------------------------- |
| **isRunning** | `boolean`                         |
| **result**    | `ICMPResultInterface`             | See [ICMPResultInterface](#icmpresultinterface)
| **start**     | `UseICMPStartParamsInterface`     | See [UseICMPStartParamsInterface](#useicmpstartparamsinterface)
| **stop**      | `() => void`                      |
#
### isReachable
`(host: string, timeout?: number) => Promise<boolean | null>`

Simple function to test whether that address is reachable. Android implementation attempts ICMP ECHO REQUESTs first, on failure it will fall back to TCP ECHO REQUESTs. Success on either protocol will return true.

The host argument can either be a machine name, such as "guthib.com", or a textual representation of its IP address.  
The timeout is 10000 (10 seconds) by default.
```tsx
import { Button } from 'react-native'

import {
    isReachable,
} from 'react-native-ping-android'

export default function App(): React.JSX.Element {
    const onPress = async () => {
        const isReached = await isReachable('guthib.com')
        console.log('Is reached: ', isReached)
    }

    return (
        <Button
            title="Test"
            onPress={ onPress }
        />
    )
}
```
#
### getHostName
`(host: string) => Promise<string | null>`

If the host argument was given with a host name, this host name will be remembered and returned; otherwise, a reverse name lookup will be performed and the result will be returned based on the system configured name lookup service.
#

## Definitions
#### ICMPResultInterface
| Properties    | Type                              | Remarks                                                                            |
| ------------- | --------------------------------- | ---------------------------------------------------------------------------------- |
| `rtt`         | `number`                          | When the `status` is not `PingStatus.ECHO`, the value will be -1 (`NO_ECHO_RTT`)
| `ttl`         | `number`                          | When the `status` is not `PingStatus.ECHO`, the value will be -1 (`NO_ECHO_TTL`)
| `status`      | `PingStatus`                      | Full references at [PingStatus](#pingstatus)

#### ICMPConstructorDataInterface
| Properties    | Type                                | Remarks                                                                                                        |
| ------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `host`        | `string`                            | Can either be a machine name, such as "guthib.com", or a textual representation of its IP address.             |
| `packetSize`  | `number` \| `null` \| `undefined`   | Value in bytes. If it smaller than zero, the promise result will be returned with `PingStatus.INVALID_ARG` status.
| `ttl`         | `number` \| `null` \| `undefined`   | [time-to-live](https://www.cloudflare.com/learning/cdn/glossary/time-to-live-ttl/)
| `timeout`     | `number` \| `null` \| `undefined`   | Value in milliseconds.

#### UseICMPInterface
| Properties    | Type                                          | Remarks                                                                                                        |
| ------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `isRunning`   | `boolean`                                     | A React state                                                                                                  |
| `result`      | `ICMPResultInterface` | `undefined`           | See [ICMPResultInterface](#icmpresultinterface)
| `start`       | `(data: UseICMPStartParamsInterface) => void` | See [UseICMPStartParamsInterface](#useicmpstartparamsinterface)
| `stop`        | `() => void`                                  | Stop the current running process. It does nothing when there is no processes.

#### UseICMPStartParamsInterface
It extends [ICMPConstructorDataInterface](#icmpconstructordatainterface)
| Properties    | Type           | Remarks                                                                                                                                        |
| ------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `count`       | `number`       | Count must be larger than 0. Otherwise, the result will be returned with `PingStatus.INVALID_ARG` status
| `interval`    | `number`       | Value in milliseconds and must be larger 0 and larger than the timeout. Otherwise, the result will be returned with `PingStatus.INVALID_ARG` status
| …             | …              | other props from [ICMPConstructorDataInterface](#icmpconstructordatainterface)

#### PingStatus
| Member                         | Value          | Remarks                                                                              |
| ------------------------------ | -------------- | ------------------------------------------------------------------------------------ |
| `ECHO`                         | `2`            | Success
| `ECHOING`                      | `1`            | When the `ping` method or `start` is invoked when the previous process still running
| `TIMEDOUT`                     | `0`            |
| `CANCELLED`                    | `-1`           |
| `UNKNOWN_HOST`                 | `-2`           |
| `INVALID_ARG`                  | `-3`           | Invalid argument such as illegal packet size, ttl out of range.
| `UNKNOWN_FAILURE`              | `-4`           |
#

## Android Emulator Limitations
Depending on the environment, the emulator might not be able to support other protocols (such as ICMP, used for "ping"). Currently, the emulator does not support IGMP or multicast. See [Local networking limitations](https://developer.android.com/studio/run/emulator-networking#networkinglimitations).

Instead, you can use Android physical device and run React Native app in it.

## Personal note about iOS support
I don't have any Mac devices😭
