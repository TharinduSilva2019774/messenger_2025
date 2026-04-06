export const getMessageList = (messages: any, reciverClarkId: string) => {
    let messaegList: any[] = []
    // Handle both cases where messages is an array (UI) or an API response with messageResponses
    console.log("messages", messages);
    const list = messages || [];
    
    if (Array.isArray(list)) {
        list.forEach((m: any) => {
            // console.log("m", m);
            // Check for unread message IDs using your original condition
            const isRead = m.isRead !== undefined ? m.isRead : m.read;
            console.log("isRead", isRead);
            // The sender's clarkId or the UI's isOwnMessage property
            const fromOther = m.clarkId === reciverClarkId  || m.isOwnMessage === false;
            console.log("fromOther", fromOther);
            console.log("fromOther && isRead === false", fromOther && isRead === false);
            if (fromOther && isRead === false) {
                messaegList.push(m.id)
                console.log("messaegList in loop", messaegList);
            }
        });
    }
    return messaegList;
}