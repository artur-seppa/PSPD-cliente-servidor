#!/bin/bash

ISO_PATH="$HOME/alpine-standard-3.19.1-x86_64.iso"

# Define e inicia lan1
sudo virsh --connect qemu:///system net-define network.xml
sudo virsh --connect qemu:///system net-start lan1
sudo virsh --connect qemu:///system net-autostart lan1

# Criar rede virtual lan2 (se ainda não existir)
sudo virsh --connect qemu:///system net-define networkLan2.xml
sudo virsh --connect qemu:///system net-start lan2
sudo virsh --connect qemu:///system net-autostart lan2
                           
# Criar VM1
virt-install \
--name vm1 \
--connect qemu:///system \
--vcpus 1 \
--memory 512 \
--disk size=5 \
--cdrom $ISO_PATH \
--network network=lan1 \
--network network=lan2 \
--os-type linux \
--os-variant generic \
--graphics none \
--noautoconsole

# Criar VM2
virt-install \
--name vm2 \
--connect qemu:///system \
--vcpus 1 \
--memory 512 \
--disk size=5 \
--cdrom $ISO_PATH \
--network network=lan2 \
--os-type linux \
--os-variant generic \
--graphics none \
--noautoconsole

# Criar VM3
virt-install \
--name vm3 \
--connect qemu:///system \
--vcpus 1 \
--memory 512 \
--disk size=5 \
--cdrom $ISO_PATH \
--network network=lan2 \
--os-type linux \
--os-variant generic \
--graphics none \
--noautoconsole

echo "Todas as VMs foram criadas! Use 'sudo virsh list --all'ou acesse o 'virt-manager' para ver o status."