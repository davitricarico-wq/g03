import type { SVGProps } from 'react';

type IconName =
    | 'activity'
    | 'alert'
    | 'arrow-down'
    | 'chevron-right'
    | 'clipboard'
    | 'edit'
    | 'eye'
    | 'eye-off'
    | 'filter'
    | 'flame'
    | 'history'
    | 'home'
    | 'lock'
    | 'map'
    | 'map-pin'
    | 'paw'
    | 'people'
    | 'person'
    | 'search'
    | 'sparkle'
    | 'target'
    | 'trash'
    | 'unlock'
    | 'user-check'
    | 'user-x'
    | 'x-circle';

const paths: Record<IconName, string[]> = {
    activity: ['M4 12h4l2-7 4 14 2-7h4'],
    alert: ['M12 3 22 20H2L12 3Z', 'M12 9v5', 'M12 17h.01'],
    'arrow-down': ['M12 3v14', 'M6 11l6 6 6-6', 'M5 21h14'],
    'chevron-right': ['M9 18l6-6-6-6'],
    clipboard: ['M9 4h6', 'M10 2h4a2 2 0 0 1 2 2v1H8V4a2 2 0 0 1 2-2Z', 'M7 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1'],
    edit: ['M12 20h9', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z'],
    eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
    'eye-off': ['M3 3l18 18', 'M10.6 10.6a2 2 0 0 0 2.8 2.8', 'M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a15.5 15.5 0 0 1-3.1 4.2', 'M6.1 6.9C3.4 8.7 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8'],
    filter: ['M4 5h16l-6 7v5l-4 2v-7L4 5Z'],
    flame: ['M12 22c4 0 7-3 7-7 0-3-2-5-4-7 0 3-2 4-3 4-2 0-3-2-2-5-3 2-5 5-5 8 0 4 3 7 7 7Z'],
    history: ['M3 12a9 9 0 1 0 3-6.7', 'M3 4v5h5', 'M12 7v5l3 2'],
    home: ['M3 11 12 3l9 8', 'M5 10v10h14V10', 'M9 20v-6h6v6'],
    lock: ['M6 10V8a6 6 0 0 1 12 0v2', 'M5 10h14v11H5V10Z'],
    map: ['M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z', 'M9 3v15', 'M15 6v15'],
    'map-pin': ['M12 22s7-6 7-13a7 7 0 0 0-14 0c0 7 7 13 7 13Z', 'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
    paw: ['M8 11c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2Z', 'M16 11c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2Z', 'M10 16c0-2 1-4 2-4s2 2 2 4c2 0 4 1 4 3 0 2-2 3-6 3s-6-1-6-3c0-2 2-3 4-3Z'],
    people: ['M16 11a4 4 0 1 0-8 0', 'M4 21a8 8 0 0 1 16 0', 'M18 8a3 3 0 0 1 0 6', 'M22 21a6 6 0 0 0-3-5'],
    person: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M4 21a8 8 0 0 1 16 0'],
    search: ['M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z', 'M21 21l-4.3-4.3'],
    sparkle: ['M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z', 'M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z'],
    target: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
    trash: ['M4 7h16', 'M10 11v6', 'M14 11v6', 'M6 7l1 14h10l1-14', 'M9 7V4h6v3'],
    unlock: ['M7 10V8a5 5 0 0 1 9.6-2', 'M5 10h14v11H5V10Z'],
    'user-check': ['M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M16 11l2 2 4-4'],
    'user-x': ['M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M17 8l4 4', 'M21 8l-4 4'],
    'x-circle': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M8 8l8 8', 'M16 8l-8 8']
};

interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number;
}

export default function Icon({ name, size = 20, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {paths[name].map((d) => <path key={d} d={d} />)}
        </svg>
    );
}
