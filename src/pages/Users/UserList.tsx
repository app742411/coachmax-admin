import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadcrumb'
import BasicTableOne from '../../components/tables/BasicTables/BasicTableOne'

const UserList = () => {
  return (
    <>
      <PageMeta title='All Users' />
      <PageBreadcrumb pageTitle='All Users' />
      <BasicTableOne />
    </>
  )
}

export default UserList
