import { classNames } from '../../../framework/utlity'
import { SideNavigationItem } from '../../../models/SideNavigationItem'

interface SideNavigationProps {
    activeIndex: number
    navigation: SideNavigationItem[]
    selectSubmenuItem: (item: SideNavigationItem) => void
}

export const SideNavigation: React.FunctionComponent<SideNavigationProps> = ({
    activeIndex,
    navigation,
    selectSubmenuItem,
}) => {
    return (
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
                {navigation.map((item: SideNavigationItem) => (
                    <a
                        key={item.name}
                        href="#"
                        onClick={() => selectSubmenuItem(item)}
                        className={classNames(
                            item.id === activeIndex.toString()
                                ? 'bg-gray-50 text-pink-700 hover:text-pink-700 hover:bg-white'
                                : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50',
                            'group rounded-md px-3 py-2 flex items-center text-sm font-medium'
                        )}
                        aria-current={item.id === activeIndex.toString() ? 'page' : undefined}
                    >
                        <item.icon
                            className={classNames(
                                item.id === activeIndex.toString()
                                    ? 'text-pink-500 group-hover:text-pink-500'
                                    : 'text-gray-400 group-hover:text-gray-500',
                                'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                            )}
                            aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                    </a>
                ))}
            </nav>
        </aside>
    )
}
