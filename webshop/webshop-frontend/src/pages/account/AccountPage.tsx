import { KeyIcon, UserCircleIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { SideNavigation } from './components/AccountSideNavigation'
import { NotificationSettings } from './components/NotificationSettings'
import { ProfileSettings } from './components/ProfileSettings'
import { ChangePassword } from './components/ChangePassword'
import { SideNavigationItem } from '../../models/SideNavigationItem'

const navigation: SideNavigationItem[] = [
    { id: '0', name: 'Account', link: '#', icon: UserCircleIcon },
    { id: '1', name: 'Change Password', link: '#', icon: KeyIcon },
]

interface AccountPageProps {}

export const AccountPage: React.FunctionComponent<AccountPageProps> = ({}) => {
    // The name of AccountSideNavigationItem is the unique index
    const [activeIndex, setActiveIndex] = useState<string>('0')

    const selectSubmenuItem = (item: SideNavigationItem): void => {
        setActiveIndex(navigation.filter((navItem) => navItem.id === item.id)[0].id)
    }

    return (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <SideNavigation
                navigation={navigation}
                activeIndex={parseInt(activeIndex)}
                selectSubmenuItem={selectSubmenuItem}
            />

            <div className="space-y-6 lg:col-span-9">
                {activeIndex === '0' && (
                    <div className="space-y-6">
                        <ProfileSettings />
                        <NotificationSettings />
                    </div>
                )}
                {activeIndex === '1' && (
                    <div>
                        <ChangePassword />
                    </div>
                )}
            </div>
        </div>
    )
}
