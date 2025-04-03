# react-native-ping-android

Expose the Internet Control Message Protocol (**ICMP**) to React Native android app.  
Measure the round-trip time (RTT) by using ICMP echo request packets to the intended destination.

🚀 This library is supported in New Architecture (Turbo Modules)

## Requirements

This library requires explicit library and React Native version due to Turbo Modules capabilities

#### New Architecture
- For React Native >= 0.76, use `react-native-ping-android` version 2.x or latest
- For React Native >= 0.72, use `react-native-ping-android` version 1.3.0
#### Old Architecture
It's marked for React Native >= 0.72 and your app can use the 2.x or latest version of this library.  
Cannot guarantee for older React Native versions support. It requires some tests.

About compatibility [here](#compatibility)

## Installation
#### Version 2.x or latest
npm
```
npm install react-native-ping-android
```

or with Yarn
```
yarn add react-native-ping-android
```
#### Version 1.3.0
npm
```
npm install react-native-ping-android@1.3.0
```

or with Yarn
```
yarn add react-native-ping-android@1.3.0
```

## Documentation Versioning
The [APIs](#apis) and [Definitions](#definitions) documentation is for the 2.x library version.  
See the previous [README.md](https://github.com/RakaDoank/react-native-ping-android/blob/291215241c542376e45d30c79f5019e4df1806e4/README.md) or visit the [npm page](https://www.npmjs.com/package/react-native-ping-android/v/1.3.0) for the 1.x version

## APIs
### ICMP
A bare JavaScript class to use ICMP controller
```tsx
import { useRef } from 'react'
import { Button } from 'react-native'

import {
    ICMP,
    type ICMPResult,
} from 'react-native-ping-android'

export default function App(): React.JSX.Element {
    const
        icmp =
            useRef<ICMP | null>(
                new ICMP({ host: '1.1.1.1', packetSize: 64, timeout: 1000, count: 3 })
            ),

        [result, setResult] =
            useState<ICMPResult | null>(null)

    useEffect(() => {
        const icmpRef = icmp.current
        return () => {
            icmpRef?.stop()
        }
    }, [])

    const onPress = async () => {
        icmp.current?.ping(res => {
            setResult({
                rtt: result.rtt,
                ttl: result.ttl,
                status: result.status,
                isEnded: result.isEnded,
            })
        })
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
#### - Constructors: (data: [ICMPConstructorData](#icmpconstructordata))
| Data Properties | Type                              | Required  | Default Value | Remarks                                                                            |
| --------------- | --------------------------------- | --------- | ------------- | ---------------------------------------------------------------------------------- |
| **host**        | `string`                          | Yes       |               | valid host, e.g. 1.1.1.1 or guthib.com. Invalid host or unknown service will return ping result with `PingStatus.UNKNOWN_HOST` status                                                                                                                                                                              |
| **packetSize**  | `number` \| `null` \| `undefined` | No        | 56            | in bytes                                                                           |
| **timeout**     | `number` \| `null` \| `undefined` | No        | 1000          | in milliseconds                                                                    |
| **ttl**         | `number` \| `null` \| `undefined` | No        | 54            | [time-to-live](https://www.cloudflare.com/learning/cdn/glossary/time-to-live-ttl/) |
| **count**       | `number` \| `null` \| `undefined` | No        | 0             | amount of try to ping. 0 is infinite count                                         |
| **interval**    | `number` \| `null` \| `undefined` | No        | 1000          | in milliseconds

#### - Methods
| Method       | Return | Remarks                                                                                                               |
| ------------ | ------ | --------------------------------------------------------------------------------------------------------------------- |
| **ping**     | `void` | Run the ICMP ping with arguments that has been defined from constructor. This method is an event listener that will invoke your callback function. If the method is invoked again while the previous process is still running, it will invoke your callback with `PingStatus.ECHOING` status.                                                                          |
| **stop**     | `void` | Stop current ICMP ping request. It's important to invoke this function to cleanup ICMP request to avoid memory leaks. It's safe to invoke this method even if there is no ping requests are running. |

#### - Properties
| Property            | Type                      |
| ------------------- | ------------------------- |
| **host**            | `readonly` `string`       |
| **packetSize**      | `readonly` `number`       |
| **timeout**         | `readonly` `number`       |
| **ttl**             | `readonly` `number`       |
| **count**           | `readonly` `number`       |
| **interval**        | `readonly` `number`       |

#### - Static Members
| Static Member       | Type              | Value             | Remarks                                                                                                     |
| ------------------- | ----------------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **NO_ECHO_RTT**     | `number`          | -1                | Just an constant whenever the status of ping result is not `PingStatus.ECHO`. It is used in the rtt result. |
| **NO_ECHO_TTL**     | `number`          | -1                | Just an constant whenever the status of ping result is not `PingStatus.ECHO`. It is used in the ttl result. |

:warning::warning::warning: **Important!**

**IT'S NOT SAFE** to unmount your component without invoke the `stop` method if there are ICMP requests that still running. Your app may still has ICMP requests that still running in the background. Consider to use `useICMP` hook that do the cleanup automatically.

# 
### useICMP
A React hook of encapsulated `ICMP` class that you may use it to simplify the cleanup handling
```tsx
import { Button } from 'react-native'

import {
    useICMP,
} from 'react-native-ping-android'

export default function App(): React.JSX.Element {
    const { isRunning, result, start, stop } = useICMP({
        host: 'guthib.com',
        packetSize: 64,
        timeout: 1000,
        interval: 1000,
        count: 10,
    })

    useEffect(() => {
        if(result) {
            console.log('Result: ', result.rtt, result.ttl, result.status)
        }
    }, [result])

    const toggle = () => {
        if(isRunning) {
            stop()
        } else {
            start()
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

It's safe to unmount your component without invoke the `stop` method. This hook will do the cleanup automatically.

#### References
#### - Returns: [UseICMP](#useicmp)
| Properties    | Type          | Remarks                                                                            |
| ------------- | ------------- | ---------------------------------------------------------------------------------- |
| **isRunning** | `boolean`     |
| **result**    | `ICMPResult`  | See [ICMPResult](#icmpresult)
| **start**     | `() => void`  |
| **stop**      | `() => void`  |
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
#### ICMPResult
| Properties    | Type                              | Remarks                                                                            |
| ------------- | --------------------------------- | ---------------------------------------------------------------------------------- |
| `rtt`         | `number`                          | When the `status` is not `PingStatus.ECHO`, the value will be -1 (`NO_ECHO_RTT`)
| `ttl`         | `number`                          | When the `status` is not `PingStatus.ECHO`, the value will be -1 (`NO_ECHO_TTL`)
| `status`      | `PingStatus`                      | Full references at [PingStatus](#pingstatus)
| `isEnded`     | `boolean`                         | `true` if there is a subsequent ping request coming.

#### ICMPConstructorData
| Properties    | Type                                | Remarks                                                                                                        |
| ------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `host`        | `string`                            | Can either be a machine name, such as "guthib.com", or a textual representation of its IP address.             |
| `packetSize`  | `number` \| `null` \| `undefined`   | Value in bytes. If it smaller than zero, the promise result will be returned with `PingStatus.INVALID_ARG` status.
| `ttl`         | `number` \| `null` \| `undefined`   | [time-to-live](https://www.cloudflare.com/learning/cdn/glossary/time-to-live-ttl/)
| `timeout`     | `number` \| `null` \| `undefined`   | Value in milliseconds.
| `count`       | `number` \| `null` \| `undefined`   | Amount of try to ping. 0 is infinite count
| `interval`    | `number` \| `null` \| `undefined`   | Value in milliseconds.

#### UseICMP
| Properties    | Type                                          | Remarks                                                                                                        |
| ------------- | -----------------------------------  | -------------------------------------------------------------------------------------------------------------- |
| `isRunning`   | `boolean`                            | A React state                                                                                                  |
| `result`      | `ICMPResult` \| `undefined`          | See [ICMPResult](#icmpresult)
| `start`       | `() => void`                         | See [UseICMPStartParams](#useicmpstartparams)
| `stop`        | `() => void`                         | Stop the current running process. It does nothing when there is no processes.

#### UseICMPProps
It extends [ICMPConstructorData](#icmpconstructordata).

#### PingStatus
| Member                         | Value          | Remarks                                                                              |
| ------------------------------ | -------------- | ------------------------------------------------------------------------------------ |
| `ECHO`                         | `2`            | Success
| `ECHOING`                      | `1`            | When the `ping` method or `start` is invoked when the previous process still running
| `TIMEDOUT`                     | `0`            |
| `INVALID_ARG`                  | `-1`           | Invalid argument such as illegal packet size, e.g. ttl out of range.
| `UNKNOWN_HOST`                 | `-2`           |
| `UNKNOWN_FAILURE`              | `-3`           |
#

## Compatibility
In the latest version, this library is using the event listener technique that performs much better rather than the resovable promise like the previous one, but he drawback is the React Native compatibility. While the new version performs better, it requires new React Native version for the New Architecture, since the [event listener (Event Emitting) capabilities](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md#add-event-emitting-capabilities) only support for React Native >= 0.76 in New Architecture, but support for React Native >= 0.72 in Old Architecture. Cannot guarantee for older React Native versions support. It requires some tests.

Better to use 2.x version, simply because it performs much better. It's because the counter and the interval logic with the `setInterval` JavaScript are moved to the Kotlin side. In Kotlin side, it will reuses the instantiated Kotlin Coroutines until it's no longer needed, and emit the ping result to your event callback without blocking the JS thread at all. Not like the 1.x version that use resovable promise the ping result, create and destroy the Coroutines immediately when the promise has resolvabled, and repeat the process in JavaScript side with `setInterval`.

## Android Emulator Limitations
Depending on the environment, the emulator might not be able to support other protocols (such as ICMP, used for "ping"). See [Local networking limitations](https://developer.android.com/studio/run/emulator-networking#networkinglimitations).

Instead, you can use Android physical device and run React Native app in it.
