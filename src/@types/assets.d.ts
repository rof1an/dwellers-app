declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    const path: string
    export default path
}

declare module '*.png' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    const path: string
    export default path
}

declare module '*.svg' {
    import React = require('react')
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
    const src: string
    export default src
}

declare module '*.img' {
    import React = require('react')
    const alt: string
    export default alt
}

declare module '*.scss' {
    const content: any
    export default content
}

declare module 'useDispatch' {
    interface DefaultRootState extends ApplicationState { }
}


